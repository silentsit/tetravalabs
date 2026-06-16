import type { StoreProduct } from "@/lib/medusa"

export type StoreVariant = NonNullable<StoreProduct["variants"]>[number]

/** Medusa v2 requires explicit fields for calculated_price and product metadata. */
export const STORE_PRODUCT_FIELDS =
  "*variants,*variants.calculated_price,+variants.prices,+metadata"

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
