export function cartLineId(productId: string, variantId: string): string {
  return `${productId}:${variantId}`
}
