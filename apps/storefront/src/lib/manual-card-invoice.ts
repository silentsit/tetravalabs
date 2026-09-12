export const MANUAL_CARD_INVOICE_ID = "manual_card_invoice" as const

export const MANUAL_CARD_INVOICE_TITLE = "Pay by Card — 📩 Email Link"

export const MANUAL_CARD_INVOICE_STEPS = [
  'Click "Place Order" to checkout',
  "Receive a secure payment link by email within 2 hours",
  "Complete payment via your credit/debit card through the link"
] as const

export const MANUAL_CARD_INVOICE_SIGNUP_NOTE =
  "No account signup or identity verification required."

export const MANUAL_CARD_INVOICE_FOLLOWUP =
  "You'll receive your tracking number within 1–2 business days."

export const MANUAL_CARD_INVOICE_DESCRIPTION = [
  ...MANUAL_CARD_INVOICE_STEPS.map((step, index) => `${index + 1}. ${step}`),
  "",
  MANUAL_CARD_INVOICE_SIGNUP_NOTE,
  "",
  MANUAL_CARD_INVOICE_FOLLOWUP
].join("\n")

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
