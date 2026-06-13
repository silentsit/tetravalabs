import { listProducts } from "@/lib/medusa"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type SearchResult = {
  id: string
  title: string
  handle: string
  category: string
  price_min: number
  price_max: number
  visual_type: string
}

export type SearchSource = "typesense" | "catalog"

export type SearchResponse = {
  results: SearchResult[]
  source: SearchSource
}

export function isTypesenseConfigured() {
  return Boolean(process.env.TYPESENSE_HOST?.trim() && process.env.TYPESENSE_API_KEY?.trim())
}

async function searchViaMedusaProxy(query: string): Promise<SearchResponse | null> {
  if (!query.trim() || !PUBLISHABLE_KEY) return null

  try {
    const url = new URL(`${MEDUSA_URL}/store/search`)
    url.searchParams.set("q", query)
    const response = await fetch(url.toString(), {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      cache: "no-store"
    })
    if (!response.ok) return null
    const data = (await response.json()) as {
      results?: SearchResult[]
      source?: SearchSource
    }
    if (!data.results) return null
    return { results: data.results, source: "typesense" }
  } catch {
    return null
  }
}

async function searchViaTypesenseDirect(query: string): Promise<SearchResult[] | null> {
  const apiKey = process.env.TYPESENSE_API_KEY
  if (!isTypesenseConfigured() || !query.trim() || !apiKey) return null

  const collection = process.env.TYPESENSE_COLLECTION || "products"
  const protocol = process.env.TYPESENSE_PROTOCOL || "http"
  const host = process.env.TYPESENSE_HOST || "localhost"
  const defaultPort = protocol === "https" ? 443 : 8108
  const port = Number(process.env.TYPESENSE_PORT || defaultPort)
  const base =
    port === defaultPort ? `${protocol}://${host}` : `${protocol}://${host}:${port}`
  const url = new URL(`${base}/collections/${collection}/documents/search`)
  url.searchParams.set("q", query)
  url.searchParams.set("query_by", "title,handle,cas_number,molecular_formula,sequence")
  url.searchParams.set("per_page", "24")

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

async function searchViaMedusaFallback(query: string): Promise<SearchResult[]> {
  const products = await listProducts()
  const q = query.trim().toLowerCase()
  const filtered = q
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

  return filtered.slice(0, 24).map((product) => {
    const prices = (product.variants || [])
      .map((variant) => variant.prices?.[0]?.amount || 0)
      .filter(Boolean)
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      category: String(product.metadata?.source_category || "Research Product"),
      price_min: prices.length ? Math.min(...prices) : 0,
      price_max: prices.length ? Math.max(...prices) : 0,
      visual_type: String(product.metadata?.visual_type || "vial")
    }
  })
}

export async function searchProducts(query: string): Promise<SearchResponse> {
  const medusaProxy = await searchViaMedusaProxy(query)
  if (medusaProxy && medusaProxy.results.length > 0) {
    return medusaProxy
  }

  const typesenseResults = await searchViaTypesenseDirect(query)
  if (typesenseResults !== null) {
    if (typesenseResults.length > 0) {
      return { results: typesenseResults, source: "typesense" }
    }
    return { results: await searchViaMedusaFallback(query), source: "catalog" }
  }

  if (medusaProxy) {
    return medusaProxy.results.length > 0
      ? medusaProxy
      : { results: await searchViaMedusaFallback(query), source: "catalog" }
  }

  return { results: await searchViaMedusaFallback(query), source: "catalog" }
}
