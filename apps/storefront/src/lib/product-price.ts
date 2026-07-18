import type { StoreProduct } from "@/lib/medusa"

export type StoreVariant = NonNullable<StoreProduct["variants"]>[number]

/** Full fields for product detail pages. */
export const STORE_PRODUCT_DETAIL_FIELDS =
  "*variants,*variants.calculated_price,+variants.prices,+variants.metadata,+variants.sku,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder,+metadata"

/** Lean fields for shop/home/search pagination — skips full variant relation blobs. */
export const STORE_PRODUCT_LIST_FIELDS =
  "id,title,handle,+metadata,+collection.title,+variants.id,+variants.title,+variants.sku,+variants.calculated_price,+variants.prices,+variants.metadata,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder"

/** @deprecated Prefer STORE_PRODUCT_DETAIL_FIELDS or STORE_PRODUCT_LIST_FIELDS. */
export const STORE_PRODUCT_FIELDS = STORE_PRODUCT_DETAIL_FIELDS

export function getVariantPriceCents(variant?: StoreVariant | null): number {
  if (!variant) return 0

  const fromPrices = variant.prices?.[0]?.amount
  if (fromPrices != null && Number(fromPrices) > 0) {
    return Number(fromPrices)
  }

  const calculated = variant.calculated_price?.calculated_amount
  if (calculated != null && Number(calculated) > 0) {
    return Number(calculated)
  }

  return 0
}

export function getProductPriceCents(product: StoreProduct): number {
  const variants = product.variants || []
  const amounts = variants.map((variant) => getVariantPriceCents(variant)).filter((amount) => amount > 0)
  if (!amounts.length) return 0
  return Math.min(...amounts)
}

export function getProductPriceRangeCents(product: StoreProduct) {
  const variants = product.variants || []
  const amounts = variants.map((variant) => getVariantPriceCents(variant)).filter((amount) => amount > 0)
  if (!amounts.length) return { min: 0, max: 0 }
  return { min: Math.min(...amounts), max: Math.max(...amounts) }
}
