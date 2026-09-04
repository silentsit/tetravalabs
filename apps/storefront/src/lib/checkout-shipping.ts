/** All orders ship free worldwide. */
export function resolveShippingUsd(_subtotalUsd?: number) {
  void _subtotalUsd
  return 0
}

export function checkoutShippingMethodLabel(shippingUsd: number) {
  if (shippingUsd === 0) return "Free Shipping"
  return "Express Shipping"
}
