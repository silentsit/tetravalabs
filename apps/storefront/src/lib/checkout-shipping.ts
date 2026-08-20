export const DEFAULT_SHIPPING_USD = 15

/** Flat $15 shipping on every order. */
export function resolveShippingUsd(_items?: unknown[]) {
  return DEFAULT_SHIPPING_USD
}
