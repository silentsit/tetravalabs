export const DEFAULT_SHIPPING_USD = 15
export const NASAL_SPRAY_SHIPPING_USD = 9

type ShippingItem = {
  handle?: string
  title?: string
}

function isNasalSprayItem(item: ShippingItem) {
  const handle = (item.handle || "").toLowerCase().trim()
  const title = (item.title || "").toLowerCase()
  return (
    handle.includes("nasal-spray") ||
    handle.startsWith("selank-nasal") ||
    handle.startsWith("semax-nasal") ||
    title.includes("nasal spray")
  )
}

/** True when every cart line is a finished nasal-spray SKU (Selank, Semax, or mixed sprays). */
export function isNasalSprayOnly(items: ShippingItem[]) {
  if (!items.length) return false
  return items.every(isNasalSprayItem)
}

/** Flat $15 shipping, except nasal-spray-only carts → $9. Mixed peptide carts stay $15. */
export function resolveShippingUsd(items: ShippingItem[]) {
  return isNasalSprayOnly(items) ? NASAL_SPRAY_SHIPPING_USD : DEFAULT_SHIPPING_USD
}
