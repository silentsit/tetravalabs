export const DEFAULT_SHIPPING_USD = 15
export const SELANK_NASAL_SHIPPING_USD = 9
export const SELANK_NASAL_HANDLE = "selank-nasal-spray-10mg"

type ShippingItem = {
  handle?: string
  title?: string
}

export function isSelankNasalSprayOnly(items: ShippingItem[]) {
  if (!items.length) return false
  return items.every((item) => {
    const handle = (item.handle || "").toLowerCase().trim()
    const title = (item.title || "").toLowerCase()
    return handle === SELANK_NASAL_HANDLE || title.includes("selank nasal spray")
  })
}

/** Flat $15 shipping, except Selank Nasal Spray-only carts → $9. */
export function resolveShippingUsd(items: ShippingItem[]) {
  return isSelankNasalSprayOnly(items) ? SELANK_NASAL_SHIPPING_USD : DEFAULT_SHIPPING_USD
}
