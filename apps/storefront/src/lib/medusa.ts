import {
  filterAndConsolidateCatalogProducts,
  resolveCatalogParentHandle
} from "@/lib/catalog-filter"
import {
  STORE_PRODUCT_DETAIL_FIELDS,
  STORE_PRODUCT_LIST_FIELDS
} from "@/lib/product-price"
import { PRODUCT_HANDLE_TO_URL, PRODUCT_URL_TO_HANDLE } from "@/lib/product-url-aliases"

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

/**
 * Batch-resolve products by handle in a single Store list request path.
 * Never call getProductByHandle in a loop — use this for editorial embeds.
 */
export async function listProductsByHandles(handles: string[]): Promise<StoreProduct[]> {
  const unique = [...new Set(handles.map((handle) => handle.trim()).filter(Boolean))]
  if (!unique.length) return []

  const wanted = new Set(unique.map((handle) => handle.toLowerCase()))

  try {
    const url = new URL(`${MEDUSA_URL}/store/products`)
    url.searchParams.set("fields", STORE_PRODUCT_LIST_FIELDS)
    url.searchParams.set("limit", String(Math.min(Math.max(unique.length * 2, 20), 100)))
    for (const handle of unique) {
      url.searchParams.append("handle", handle)
    }

    const response = await fetch(url.toString(), {
      headers: withHeaders(),
      next: {
        revalidate: 300,
        tags: ["products", ...unique.map((handle) => `product:${handle}`)]
      }
    })

    if (response.ok) {
      const data = await response.json()
      const batch = filterAndConsolidateCatalogProducts((data.products || []) as StoreProduct[])
      if (batch.length > 0) {
        const matched = batch.filter((product) => wanted.has(product.handle.toLowerCase()))
        const allResultsAreWanted = batch.every((product) =>
          wanted.has(product.handle.toLowerCase())
        )
        // Trust the batch only when the API actually filtered by handle.
        if (allResultsAreWanted) {
          return matched
        }
      }
    }
  } catch (error) {
    console.error("[medusa] listProductsByHandles failed", error)
  }

  // Single catalog list + in-memory filter (still one batch; no per-handle fetches).
  const catalog = await listProducts()
  return catalog.filter((product) => wanted.has(product.handle.toLowerCase()))
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

function mergeCoaDocuments(...batches: StoreCoaDocument[][]) {
  const seen = new Set<string>()
  const merged: StoreCoaDocument[] = []
  for (const docs of batches) {
    for (const doc of docs) {
      if (seen.has(doc.id)) continue
      seen.add(doc.id)
      merged.push(doc)
    }
  }
  return merged.sort((a, b) => {
    if (a.document_type !== b.document_type) {
      return a.document_type === "coa" ? -1 : 1
    }
    const aTime = a.tested_at ? Date.parse(a.tested_at) : 0
    const bTime = b.tested_at ? Date.parse(b.tested_at) : 0
    return bTime - aTime
  })
}

/**
 * Older COA imports used retired variant IDs; doc ids / metadata still encode the
 * catalog strength handle. Map those slugs onto current Medusa handles.
 */
const COA_DOC_HANDLE_ALIASES: Record<string, string> = {
  "nad-plus-100mg": "nad-100mg",
  "nad-plus-500mg": "nad-500mg",
  "nad-plus-1000mg": "nad-1000mg",
  "bpc-157-capsules-100ct": "bpc-157-capsules-100-count-500mcg",
  "pinealon-capsules-100ct": "pinealon-capsules-100-count",
  "glow-tb500-bpc-157-ghk-cu-70mg": "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg",
  "glow-blend-85mg": "glow-bpc-157-tb500-ghk-cu-85mg",
  "glow-blend-30mg": "glow-bpc-157-tb500-ghk-cu-30mg",
  "cu-tb500-bpc-157-kpv-blend-80mg": "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg",
  "bpc-157-tb500-blend-10mg": "bpc-157-5mg-tb500-5mg-10mg",
  "bpc-157-tb500-blend-20mg": "bpc-157-5mg-tb500-5mg-20mg",
  "cjc-1295-ipamorelin-blend-10mg": "cjc-1295-without-dac-ipamorelin-blend-10mg",
  "cjc-1295-sermorelin-ipamorelin-blend-5mg":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg"
}

function catalogHandlesForCoa(doc: StoreCoaDocument): string[] {
  const handles = new Set<string>()
  const metaHandle = doc.metadata?.variant_handle
  if (typeof metaHandle === "string" && metaHandle.trim()) {
    handles.add(metaHandle.trim())
  }

  const idMatch = /^(?:coa|hplc)_(.+)_batch_/i.exec(doc.id)
  if (idMatch) {
    const slug = idMatch[1].replace(/_/g, "-")
    handles.add(slug)
    const aliased = COA_DOC_HANDLE_ALIASES[slug]
    if (aliased) handles.add(aliased)
  }

  return [...handles]
}

type CoaCatalogIndex = {
  byVariantId: Map<string, StoreCoaDocument[]>
  byHandle: Map<string, StoreCoaDocument[]>
}

function buildCoaCatalogIndex(docs: StoreCoaDocument[]): CoaCatalogIndex {
  const byVariantId = new Map<string, StoreCoaDocument[]>()
  const byHandle = new Map<string, StoreCoaDocument[]>()

  const push = (map: Map<string, StoreCoaDocument[]>, key: string, doc: StoreCoaDocument) => {
    const list = map.get(key)
    if (list) list.push(doc)
    else map.set(key, [doc])
  }

  for (const doc of docs) {
    if (doc.variant_id) push(byVariantId, doc.variant_id, doc)
    for (const handle of catalogHandlesForCoa(doc)) {
      push(byHandle, handle, doc)
    }
  }

  return { byVariantId, byHandle }
}

/** COAs are often linked to one pack size (e.g. 10-vial); merge across strength variants. */
export async function listCoasForVariants(variantIds: string[]) {
  const uniqueIds = [...new Set(variantIds.filter(Boolean))]
  if (uniqueIds.length === 0) return [] as StoreCoaDocument[]

  const index = buildCoaCatalogIndex(await listRecentCoas(500))
  return mergeCoaDocuments(...uniqueIds.map((id) => index.byVariantId.get(id) || []))
}

/**
 * Resolve COAs for a product strength: live variant links + handle rematch for
 * documents still pointing at retired variant IDs after pack/SKU rebuilds.
 */
export async function listCoasForProduct(options: {
  variantIds: string[]
  catalogHandles: string[]
}) {
  const variantIds = [...new Set(options.variantIds.filter(Boolean))]
  const catalogHandles = [...new Set(options.catalogHandles.filter(Boolean))]
  const index = buildCoaCatalogIndex(await listRecentCoas(500))

  return mergeCoaDocuments(
    ...variantIds.map((id) => index.byVariantId.get(id) || []),
    ...catalogHandles.map((handle) => index.byHandle.get(handle) || [])
  )
}

/** One catalog fetch, then resolve COAs for many strengths (PDP side-data). */
export async function listCoasForStrengths(
  strengths: Array<{
    strengthKey: string
    variantIds: string[]
    catalogHandles: string[]
  }>
): Promise<Record<string, StoreCoaDocument[]>> {
  const index = buildCoaCatalogIndex(await listRecentCoas(500))
  const result: Record<string, StoreCoaDocument[]> = {}

  for (const strength of strengths) {
    const variantIds = [...new Set(strength.variantIds.filter(Boolean))]
    const catalogHandles = [...new Set(strength.catalogHandles.filter(Boolean))]
    result[strength.strengthKey] = mergeCoaDocuments(
      ...variantIds.map((id) => index.byVariantId.get(id) || []),
      ...catalogHandles.map((handle) => index.byHandle.get(handle) || [])
    )
  }

  return result
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
    const catalogHandle = PRODUCT_URL_TO_HANDLE[handle] || handle
    const product = products.find(
      (item) => item.handle === catalogHandle || item.handle === handle
    )
    const variantIds = (product?.variants || []).map((variant) => variant.id)
    if (!product || variantIds.length === 0) continue

    const coas = await listCoasForProduct({
      variantIds,
      catalogHandles: [product.handle, catalogHandle, handle]
    })
    const document = coas.find(isPreviewableCoa)
    if (document) {
      const publicHandle =
        PRODUCT_HANDLE_TO_URL[product.handle] || product.handle
      return {
        document,
        productHandle: publicHandle,
        productTitle: product.title.replace(/TB500/g, "TB-500").replace(/tb500/g, "tb-500")
      }
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
