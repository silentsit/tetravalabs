export const MANUAL_CARD_INVOICE_ID = "manual_card_invoice" as const

export const MANUAL_CARD_INVOICE_TITLE = "Credit/Debit Cards (Visa/MasterCard)"

export const MANUAL_CARD_INVOICE_INTERNAL_NOTE = "Awaiting invoice payment"

export const EMAIL_BRAND_SHORT = (process.env.EMAIL_BRAND_SHORT || "Tetrava").trim() || "Tetrava"

export function opsNewOrderEmail() {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "info@tetravalabs.com"
  )
}

export function isInvoicePaymentMethod(value: unknown): boolean {
  return value === MANUAL_CARD_INVOICE_ID || value === "card" || value === "cheque"
}
