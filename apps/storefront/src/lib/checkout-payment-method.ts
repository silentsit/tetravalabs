export type CheckoutPaymentMethod = "card" | "crypto" | "wise" | "manual_card_invoice"

const methodKey = (orderId: string) => `tetrava_pay_method_${orderId}`

export function isCheckoutPaymentMethod(value: unknown): value is CheckoutPaymentMethod {
  return value === "card" || value === "crypto" || value === "wise" || value === "manual_card_invoice"
}

export function resolveCheckoutPaymentMethod(value: unknown): CheckoutPaymentMethod {
  if (value === "crypto" || value === "wise" || value === "manual_card_invoice") return value
  if (value === "card" || value === "cardtousdt" || value === "cheque") {
    return "card"
  }
  return isCheckoutPaymentMethod(value) ? value : "card"
}

export function storeCheckoutPaymentMethod(orderId: string, method: CheckoutPaymentMethod) {
  if (typeof window === "undefined" || !orderId) return
  sessionStorage.setItem(methodKey(orderId), method)
}

export function readCheckoutPaymentMethod(orderId: string): CheckoutPaymentMethod | "" {
  if (typeof window === "undefined" || !orderId) return ""
  const stored = sessionStorage.getItem(methodKey(orderId))
  if (!stored) return ""
  if (isCheckoutPaymentMethod(stored)) return stored
  return resolveCheckoutPaymentMethod(stored)
}
