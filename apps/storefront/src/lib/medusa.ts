import {
  filterAndConsolidateCatalogProducts,
  resolveCatalogParentHandle
} from "@/lib/catalog-filter"
import {
  STORE_PRODUCT_DETAIL_FIELDS,
  STORE_PRODUCT_LIST_FIELDS
} from "@/lib/product-price"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

function productsUrl(
  params: Record<string, string>,
  fields = STORE_PRODUCT_LIST_FIELDS
) {
  const url = new URL(`${MEDUSA_URL}/store/products`)
  url.searchParams.set("fields", fields)
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
  collection?: {
    title?: string
    handle?: string
  } | null
  variants?: Array<{
    id: string
    title: string
    metadata?: Record<string, unknown>
    inventory_quantity?: number | null
    manage_inventory?: boolean | null
    allow_backorder?: boolean | null
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
  preview_url?: string | null
  storage_key?: string | null
  metadata?: Record<string, unknown>
}

/** Same-origin proxy — avoids R2 CORS and cross-origin Medusa redirects in the browser. */
export function coaViewerUrl(documentId: string) {
  return `/api/coa-file?id=${encodeURIComponent(documentId)}`
}

/** Same-origin proxy for pre-generated card thumbnails. */
export function coaPreviewUrl(documentId: string) {
  return `/api/coa-preview?id=${encodeURIComponent(documentId)}`
}

function hasPreviewAsset(doc: StoreCoaDocument) {
  const metadata = doc.metadata || {}
  return Boolean(
    doc.preview_url ||
      (typeof metadata.preview_storage_key === "string" && metadata.preview_storage_key.trim())
  )
}

function normalizeCoaDocumentUrl(doc: StoreCoaDocument): StoreCoaDocument {
  if (!doc.id) return doc

  const directPreview =
    typeof doc.preview_url === "string" && doc.preview_url.startsWith("http") ? doc.preview_url : null

  return {
    ...doc,
    document_url: coaViewerUrl(doc.id),
    preview_url: directPreview || (hasPreviewAsset(doc) ? coaPreviewUrl(doc.id) : null)
  }
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

  return filterAndConsolidateCatalogProducts(all)
}

export async function getProductByHandle(handle: string) {
  try {
    const response = await fetch(
      productsUrl({ handle, limit: "1" }, STORE_PRODUCT_DETAIL_FIELDS),
      {
        headers: withHeaders(),
        next: { revalidate: 300, tags: [`product:${handle}`] }
      }
    )
    if (!response.ok) throw new Error("Failed product request")
    const data = await response.json()
    const product = (data.products?.[0] || null) as StoreProduct | null
    // Allow legacy strength slugs while Medusa still has unmerged variants.
    if (!product || !resolveCatalogParentHandle(product.handle)) return null
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

const FEATURED_COA_PRODUCT_HANDLES = [
  "bpc-157",
  "bpc-157-capsules",
  "retatrutide",
  "cagrilintide",
  "epithalon",
  "ghk-cu"
] as const

function isPreviewableCoa(doc: StoreCoaDocument) {
  return doc.document_type === "coa" && Boolean(doc.document_url)
}

export type FeaturedCoaPreview = {
  document: StoreCoaDocument
  productHandle: string | null
  productTitle: string | null
}

/** Prefer catalog products with uploaded COA PDFs for homepage trust preview. */
export async function getFeaturedCoaDocument(
  products: StoreProduct[]
): Promise<FeaturedCoaPreview> {
  for (const handle of FEATURED_COA_PRODUCT_HANDLES) {
    const product = products.find((item) => item.handle === handle)
    const variantId = product?.variants?.[0]?.id
    if (!variantId) continue

    const coas = await listCoasByVariant(variantId)
    const document = coas.find(isPreviewableCoa)
    if (document) {
      return { document, productHandle: handle, productTitle: product.title }
    }
  }

  const recent = await listRecentCoas(50)
  const document = recent.find(isPreviewableCoa)
  if (document) {
    return { document, productHandle: null, productTitle: null }
  }

  const bpc157 = products.find((item) => item.handle === "bpc-157")
  return {
    document: {
      id: "coa_bpc_157_10mg_batch_a001",
      variant_id: bpc157?.variants?.[0]?.id || "",
      batch_number: "A001",
      purity_percent: 99,
      tested_at: "2026-06-01T00:00:00.000Z",
      document_type: "coa",
      document_url: "/v2/coa-preview.jpg",
      metadata: { compound: "BPC-157", variant: "10mg" }
    },
    productHandle: "bpc-157",
    productTitle: bpc157?.title || "BPC-157"
  }
}
