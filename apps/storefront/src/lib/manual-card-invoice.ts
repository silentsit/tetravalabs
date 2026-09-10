export const MANUAL_CARD_INVOICE_ID = "manual_card_invoice" as const

export const MANUAL_CARD_INVOICE_TITLE =
  "Credit/Debit Cards (Visa/MasterCard/Amex/Discover)"

export const MANUAL_CARD_INVOICE_DESCRIPTION_LINES = [
  '1. Click on "Place order".',
  "2. You will receive an email with instructions on how to make payment via credit/debit card.",
  "3. Once payment is complete, we will update you with your tracking number within 48 hours."
] as const

export const MANUAL_CARD_INVOICE_DESCRIPTION =
  MANUAL_CARD_INVOICE_DESCRIPTION_LINES.join("\n")

export const MANUAL_CARD_INVOICE_INTERNAL_NOTE = "Awaiting invoice payment"

export const MANUAL_CARD_INVOICE_THANK_YOU =
  "We've received your order. Check your email for the receipt. We'll send a PayPal invoice next so you can pay by card."

export const manualCardInvoiceConfig = {
  id: MANUAL_CARD_INVOICE_ID,
  title: MANUAL_CARD_INVOICE_TITLE,
  description: MANUAL_CARD_INVOICE_DESCRIPTION,
  captureMode: "none" as const,
  initialStatus: "ON_HOLD" as const,
  showCardForm: false,
  redirectToProcessor: false
}
