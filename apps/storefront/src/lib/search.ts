import { listProducts } from "@/lib/medusa"
import { resolveCatalogParentHandle } from "@/lib/catalog-filter"
import { getProductPerUnitPriceRangeCents } from "@/lib/pack-pricing"
import { getProductPriceRangeCents } from "@/lib/product-price"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type SearchFilters = {
  category?: string
  priceMin?: number
  priceMax?: number
}

export type SearchResult = {
  id: string
  title: string
  handle: string
  category: string
  /** Pack-total cents (legacy index / filters) */
  price_min: number
  price_max: number
  /** Per-unit cents when product uses pack tiers */
  unit_price_min?: number
  unit_price_max?: number
  moq_qty?: number
  visual_type: string
}

export type SearchSource = "typesense" | "catalog"

export type SearchResponse = {
  results: SearchResult[]
  source: SearchSource
}

function normalizeSearchResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const normalized: SearchResult[] = []

  for (const result of results) {
    const parent = resolveCatalogParentHandle(result.handle)
    if (!parent || seen.has(parent)) continue
    seen.add(parent)
    normalized.push(parent === result.handle ? result : { ...result, handle: parent })
  }

  return normalized
}

export function isTypesenseConfigured() {
  return Boolean(process.env.TYPESENSE_HOST?.trim() && process.env.TYPESENSE_API_KEY?.trim())
}

type MedusaProxyResult =
  | { status: "success"; response: SearchResponse }
  | { status: "unavailable" }
  | { status: "error" }

async function searchViaMedusaProxy(
  query: string,
  filters?: SearchFilters
): Promise<MedusaProxyResult> {
  if (!PUBLISHABLE_KEY) return { status: "unavailable" }
  if (!query.trim() && !filters?.category && filters?.priceMin == null && filters?.priceMax == null) {
    return { status: "unavailable" }
  }

  try {
    const url = new URL(`${MEDUSA_URL}/store/search`)
    if (query.trim()) url.searchParams.set("q", query)
    else url.searchParams.set("q", "*")
    if (filters?.category) url.searchParams.set("category", filters.category)
    if (filters?.priceMin != null) url.searchParams.set("price_min", String(filters.priceMin))
    if (filters?.priceMax != null) url.searchParams.set("price_max", String(filters.priceMax))
    const response = await fetch(url.toString(), {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      cache: "no-store"
    })

    if (response.status === 503) {
      return { status: "unavailable" }
    }

    const contentType = response.headers.get("content-type") || ""
    if (!response.ok || !contentType.includes("application/json")) {
      return { status: "error" }
    }

    const data = (await response.json()) as {
      results?: SearchResult[]
    }

    return {
      status: "success",
      response: {
        results: normalizeSearchResults(data.results ?? []),
        source: "typesense"
      }
    }
  } catch {
    return { status: "error" }
  }
}

async function searchViaTypesenseDirect(
  query: string,
  filters?: SearchFilters
): Promise<SearchResult[] | null> {
  const apiKey = process.env.TYPESENSE_API_KEY
  if (!isTypesenseConfigured() || !apiKey) return null
  if (!query.trim() && !filters?.category && filters?.priceMin == null && filters?.priceMax == null) {
    return null
  }

  const collection = process.env.TYPESENSE_COLLECTION || "products"
  const protocol = process.env.TYPESENSE_PROTOCOL || "http"
  const host = process.env.TYPESENSE_HOST || "localhost"
  const defaultPort = protocol === "https" ? 443 : 8108
  const port = Number(process.env.TYPESENSE_PORT || defaultPort)
  const base =
    port === defaultPort ? `${protocol}://${host}` : `${protocol}://${host}:${port}`
  const url = new URL(`${base}/collections/${collection}/documents/search`)
  url.searchParams.set("q", query.trim() || "*")
  url.searchParams.set("query_by", "title,handle,cas_number,molecular_formula,sequence")
  url.searchParams.set("per_page", "24")
  const filterParts: string[] = []
  if (filters?.category) filterParts.push(`category:=\`${filters.category}\``)
  if (filters?.priceMin != null) filterParts.push(`price_min:>=${Math.round(filters.priceMin)}`)
  if (filters?.priceMax != null) filterParts.push(`price_max:<=${Math.round(filters.priceMax)}`)
  if (filterParts.length) url.searchParams.set("filter_by", filterParts.join(" && "))

  try {
    const response = await fetch(url.toString(), {
      headers: { "X-TYPESENSE-API-KEY": apiKey },
      cache: "no-store"
    })
    if (!response.ok) return null
    const data = await response.json()
    const hits = (data.hits || []) as Array<{ document: SearchResult }>
    return hits.map((hit) => hit.document)
  } catch {
    return null
  }
}

async function searchViaMedusaFallback(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
  const products = await listProducts()
  const q = query.trim().toLowerCase()
  let filtered = q
    ? products.filter((product) => {
        const haystack = [
          product.title,
          product.handle,
          String(product.metadata?.cas_number || ""),
          String(product.metadata?.molecular_formula || ""),
          String(product.metadata?.sequence || "")
        ]
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      })
    : products

  if (filters?.category) {
    const category = filters.category.toLowerCase()
    filtered = filtered.filter(
      (product) =>
        String(product.metadata?.source_category || "").toLowerCase() === category
    )
  }

  if (filters?.priceMin != null || filters?.priceMax != null) {
    filtered = filtered.filter((product) => {
      const { min, max } = getProductPriceRangeCents(product)
      if (filters.priceMin != null && max < filters.priceMin) return false
      if (filters.priceMax != null && min > filters.priceMax) return false
      return true
    })
  }

  return filtered.slice(0, 24).map((product) => {
    const { min, max } = getProductPriceRangeCents(product)
    const unitRange = getProductPerUnitPriceRangeCents(product)
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      category: String(product.metadata?.source_category || "Research Product"),
      price_min: min,
      price_max: max,
      unit_price_min: unitRange.moqQty != null ? unitRange.min : undefined,
      unit_price_max: unitRange.moqQty != null ? unitRange.max : undefined,
      moq_qty: unitRange.moqQty ?? undefined,
      visual_type: String(product.metadata?.visual_type || "vial")
    }
  })
}

export async function searchProducts(
  query: string,
  filters?: SearchFilters
): Promise<SearchResponse> {
  const medusaProxy = await searchViaMedusaProxy(query, filters)
  if (medusaProxy.status === "success") {
    return medusaProxy.response
  }

  const typesenseResults = await searchViaTypesenseDirect(query, filters)
  if (typesenseResults !== null) {
    return { results: normalizeSearchResults(typesenseResults), source: "typesense" }
  }

  return { results: normalizeSearchResults(await searchViaMedusaFallback(query, filters)), source: "catalog" }
}
