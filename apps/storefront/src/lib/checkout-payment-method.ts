export type CheckoutPaymentMethod = "card" | "crypto" | "wise"

const methodKey = (orderId: string) => `tetrava_pay_method_${orderId}`

export function isCheckoutPaymentMethod(value: unknown): value is CheckoutPaymentMethod {
  return value === "card" || value === "crypto" || value === "wise"
}

export function resolveCheckoutPaymentMethod(value: unknown): CheckoutPaymentMethod {
  return isCheckoutPaymentMethod(value) ? value : "card"
}

export function storeCheckoutPaymentMethod(orderId: string, method: CheckoutPaymentMethod) {
  if (typeof window === "undefined" || !orderId) return
  sessionStorage.setItem(methodKey(orderId), method)
}

export function readCheckoutPaymentMethod(orderId: string): CheckoutPaymentMethod | "" {
  if (typeof window === "undefined" || !orderId) return ""
  const stored = sessionStorage.getItem(methodKey(orderId))
  return isCheckoutPaymentMethod(stored) ? stored : ""
}
