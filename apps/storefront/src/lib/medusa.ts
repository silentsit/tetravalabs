import { filterToCatalogProducts, isCatalogProductHandle } from "@/lib/catalog-filter"
import { STORE_PRODUCT_FIELDS } from "@/lib/product-price"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function productsUrl(params: Record<string, string>) {
  const url = new URL(`${MEDUSA_URL}/store/products`)
  url.searchParams.set("fields", STORE_PRODUCT_FIELDS)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return url.toString()
}

export type StoreProduct = {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown>
  variants?: Array<{
    id: string
    title: string
    metadata?: Record<string, unknown>
    prices?: Array<{
      amount: number
      currency_code: string
    }>
    calculated_price?: {
      calculated_amount?: number
      original_amount?: number
      currency_code?: string
    }
  }>
}

export type StoreCoaDocument = {
  id: string
  variant_id: string
  batch_number: string
  purity_percent: number | null
  tested_at: string | null
  document_type: "coa" | "hplc"
  document_url: string
  storage_key?: string | null
  metadata?: Record<string, unknown>
}

/** Same-origin proxy — avoids R2 CORS and cross-origin Medusa redirects in the browser. */
export function coaViewerUrl(documentId: string) {
  return `/api/coa-file?id=${encodeURIComponent(documentId)}`
}

function normalizeCoaDocumentUrl(doc: StoreCoaDocument): StoreCoaDocument {
  if (!doc.id) return doc
  return { ...doc, document_url: coaViewerUrl(doc.id) }
}

const withHeaders = (headers: HeadersInit = {}) => ({
  ...headers,
  ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
})

export async function listProducts() {
  return listAllProducts()
}

export async function listAllProducts() {
  const all: StoreProduct[] = []
  const limit = 100
  let offset = 0

  try {
    while (true) {
      const response = await fetch(productsUrl({ limit: String(limit), offset: String(offset) }), {
        headers: withHeaders(),
        next: { revalidate: 3600, tags: ["products"] }
      })
      if (!response.ok) break
      const data = await response.json()
      const batch = (data.products || []) as StoreProduct[]
      all.push(...batch)
      if (batch.length < limit) break
      offset += limit
    }
  } catch (error) {
    console.error("[medusa] unable to paginate products from", MEDUSA_URL, error)
  }

  return filterToCatalogProducts(all)
}

export async function getProductByHandle(handle: string) {
  try {
    const response = await fetch(productsUrl({ handle, limit: "1" }), {
      headers: withHeaders(),
      next: { revalidate: 300, tags: [`product:${handle}`] }
    })
    if (!response.ok) throw new Error("Failed product request")
    const data = await response.json()
    const product = (data.products?.[0] || null) as StoreProduct | null
    if (!product || !isCatalogProductHandle(product.handle)) return null
    return product
  } catch {
    return null
  }
}

export async function listCoasByVariant(variantId: string) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/coas?variant_id=${encodeURIComponent(variantId)}`,
      {
        headers: withHeaders(),
        next: { revalidate: 300, tags: [`coas:${variantId}`] }
      }
    )
    if (!response.ok) throw new Error("Failed COA request")
    const data = await response.json()
    return ((data.items || []) as StoreCoaDocument[]).map(normalizeCoaDocumentUrl)
  } catch {
    return []
  }
}

export async function listRecentCoas(limit = 50) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/coas?limit=${limit}`, {
      headers: withHeaders(),
      next: { revalidate: 300, tags: ["coas:recent"] }
    })
    if (!response.ok) throw new Error("Failed COA request")
    const data = await response.json()
    return ((data.items || []) as StoreCoaDocument[]).map(normalizeCoaDocumentUrl)
  } catch {
    return []
  }
}
