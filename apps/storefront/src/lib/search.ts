import { listProducts } from "@/lib/medusa"

export type SearchResult = {
  id: string
  title: string
  handle: string
  category: string
  price_min: number
  price_max: number
  visual_type: string
}

async function searchViaTypesense(query: string): Promise<SearchResult[]> {
  const host = process.env.TYPESENSE_HOST
  const apiKey = process.env.TYPESENSE_API_KEY
  const protocol = process.env.TYPESENSE_PROTOCOL || "http"
  const port = process.env.TYPESENSE_PORT || "8108"
  const collection = process.env.TYPESENSE_COLLECTION || "products"

  if (!host || !apiKey || !query.trim()) return []

  const url = new URL(`${protocol}://${host}:${port}/collections/${collection}/documents/search`)
  url.searchParams.set("q", query)
  url.searchParams.set("query_by", "title,handle,cas_number,molecular_formula,sequence")
  url.searchParams.set("per_page", "24")

  const response = await fetch(url.toString(), {
    headers: { "X-TYPESENSE-API-KEY": apiKey },
    cache: "no-store"
  })
  if (!response.ok) return []
  const data = await response.json()
  const hits = (data.hits || []) as Array<{ document: SearchResult }>
  return hits.map((hit) => hit.document)
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

export async function searchProducts(query: string) {
  const typesenseResults = await searchViaTypesense(query)
  if (typesenseResults.length > 0) return typesenseResults
  return searchViaMedusaFallback(query)
}
