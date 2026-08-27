/** Standard shipping is included on every order at no extra charge. */
export function resolveShippingUsd(_subtotalUsd?: number) {
  return 0
}

export function formatUsdAmount(value: number) {
  const rounded = Math.round(value * 100) / 100
  if (Number.isInteger(rounded)) return `$${rounded}`
  return `$${rounded.toFixed(2)}`
}
