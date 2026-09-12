export const MANUAL_CARD_INVOICE_ID = "manual_card_invoice" as const

export const MANUAL_CARD_INVOICE_TITLE = "Credit/Debit Cards (Visa/MasterCard)"

export const MANUAL_CARD_INVOICE_DESCRIPTION_LINES = [
  '1. Click "Place Order" to checkout.',
  "2. You will receive an email with a payment link within 2 hours.",
  "3. Click on the payment link and complete the payment via your credit/debit card.",
  "",
  "You will receive your tracking number within 1 - 2 business days."
] as const

export const MANUAL_CARD_INVOICE_DESCRIPTION =
  MANUAL_CARD_INVOICE_DESCRIPTION_LINES.join("\n")

export const MANUAL_CARD_INVOICE_INTERNAL_NOTE = "Awaiting invoice payment"

export const MANUAL_CARD_INVOICE_THANK_YOU =
  "We've received your order. Watch your inbox for a payment link within 2 hours, then pay by credit or debit card."

export const manualCardInvoiceConfig = {
  id: MANUAL_CARD_INVOICE_ID,
  title: MANUAL_CARD_INVOICE_TITLE,
  description: MANUAL_CARD_INVOICE_DESCRIPTION,
  captureMode: "none" as const,
  initialStatus: "ON_HOLD" as const,
  showCardForm: false,
  redirectToProcessor: false
}
