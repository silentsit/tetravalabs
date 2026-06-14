import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import { buildTypesenseBaseUrl, isTypesenseConfigured } from "./typesense-search"

const collection = () => process.env.TYPESENSE_COLLECTION || "products"

export type TypesenseProductDoc = {
  id: string
  title: string
  handle: string
  category: string
  strengths: string[]
  cas_number: string
  molecular_formula: string
  sequence: string
  visual_type: string
  price_min: number
  price_max: number
  coa_available: boolean
}

type ProductRow = {
  id: string
  title: string
  handle: string
  metadata?: Record<string, unknown> | null
  variants?: Array<{
    title: string
    prices?: Array<{ amount: number | string }>
    calculated_price?: { calculated_amount?: number }
  }>
}

function variantPriceCents(variant: NonNullable<ProductRow["variants"]>[number]) {
  const fromPrices = variant.prices?.[0]?.amount
  if (fromPrices != null && Number(fromPrices) > 0) return Number(fromPrices)
  const calculated = variant.calculated_price?.calculated_amount
  if (calculated != null && Number(calculated) > 0) return Number(calculated)
  return 0
}

export function mapProductToTypesenseDoc(product: ProductRow): TypesenseProductDoc {
  const prices = (product.variants || []).map(variantPriceCents).filter((amount) => amount > 0)
  const priceMin = prices.length ? Math.min(...prices) : 0
  const priceMax = prices.length ? Math.max(...prices) : 0
  const metadata = product.metadata || {}

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    category: String(metadata.source_category || "Research Product"),
    strengths: (product.variants || []).map((variant) => variant.title),
    cas_number: String(metadata.cas_number || ""),
    molecular_formula: String(metadata.molecular_formula || ""),
    sequence: String(metadata.sequence || ""),
    visual_type: String(metadata.visual_type || "vial"),
    price_min: priceMin,
    price_max: priceMax,
    coa_available: Boolean(metadata.coa_available)
  }
}

async function typesenseRequest(path: string, init: RequestInit) {
  const apiKey = process.env.TYPESENSE_API_KEY
  if (!isTypesenseConfigured() || !apiKey) {
    return { ok: false, status: 503, error: "Typesense is not configured" }
  }

  const base = buildTypesenseBaseUrl()
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "X-TYPESENSE-API-KEY": apiKey,
      ...(init.headers || {})
    }
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    return { ok: false, status: response.status, error: body || response.statusText }
  }

  return { ok: true, status: response.status }
}

export async function upsertTypesenseProduct(doc: TypesenseProductDoc) {
  return typesenseRequest(`/collections/${collection()}/documents?action=upsert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc)
  })
}

export async function deleteTypesenseProduct(productId: string) {
  return typesenseRequest(
    `/collections/${collection()}/documents/${encodeURIComponent(productId)}`,
    { method: "DELETE" }
  )
}

export async function fetchProductForTypesense(
  container: MedusaContainer,
  productId: string
): Promise<ProductRow | null> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "metadata", "variants.*", "variants.prices.*"],
    filters: { id: productId }
  })

  const product = (data?.[0] || null) as ProductRow | null
  return product
}

export async function syncProductToTypesense(container: MedusaContainer, productId: string) {
  const product = await fetchProductForTypesense(container, productId)
  if (!product) {
    return { ok: false, error: "Product not found" }
  }

  return upsertTypesenseProduct(mapProductToTypesenseDoc(product))
}
