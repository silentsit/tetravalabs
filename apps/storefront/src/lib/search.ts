import { listProducts } from "@/lib/medusa"
import {
  buildTypesenseSearchUrl,
  isTypesenseConfigured as isTypesenseEnvConfigured
} from "@/lib/typesense-config"

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
  return isTypesenseEnvConfigured()
}

async function searchViaTypesense(query: string): Promise<SearchResult[] | null> {
  const apiKey = process.env.TYPESENSE_API_KEY
  if (!isTypesenseConfigured() || !query.trim() || !apiKey) return null

  const url = buildTypesenseSearchUrl(query)

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
  const typesenseResults = await searchViaTypesense(query)
  if (typesenseResults !== null) {
    if (typesenseResults.length > 0) {
      return { results: typesenseResults, source: "typesense" }
    }
    const catalogResults = await searchViaMedusaFallback(query)
    return { results: catalogResults, source: "catalog" }
  }
  return { results: await searchViaMedusaFallback(query), source: "catalog" }
}
