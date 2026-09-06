export const CHECKOUT_WHATSAPP_E164 = "66620272123"
export const CHECKOUT_WHATSAPP_DISPLAY = "+66 62 027 2123"

export function checkoutWhatsAppHref(text?: string) {
  const url = new URL(`https://wa.me/${CHECKOUT_WHATSAPP_E164}`)
  if (text?.trim()) url.searchParams.set("text", text.trim())
  return url.toString()
}

export function formatCheckoutUsd(amount: number) {
  if (!Number.isFinite(amount) || amount < 0) return "$0.00"
  return `$${amount.toFixed(2)}`
}
