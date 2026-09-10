import { MANUAL_CARD_INVOICE_TITLE } from "@/lib/manual-card-invoice"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type InvoiceOrderItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
  handle?: string
}

export type InvoiceShipping = {
  firstName?: string
  lastName?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  postalCode?: string
  phone?: string
  country?: string
}

export async function recordManualCardInvoice(input: {
  orderId: string
  email: string
  displayId?: number
  firstName?: string
  lastName?: string
  totalUsd: number
  items: InvoiceOrderItem[]
  shipping?: InvoiceShipping
}) {
  if (!PUBLISHABLE_KEY) {
    return { ok: false as const, reason: "NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY not configured" }
  }

  try {
    const response = await fetch(`${MEDUSA_URL}/store/payments/invoice-order`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: input.orderId,
        email: input.email,
        display_id: input.displayId,
        first_name: input.firstName,
        last_name: input.lastName,
        amount_usd: input.totalUsd,
        payment_method_title: MANUAL_CARD_INVOICE_TITLE,
        items: input.items,
        shipping: input.shipping
      }),
      cache: "no-store"
    })

    if (!response.ok) {
      const message = await response.text()
      return { ok: false as const, reason: message || "Unable to record invoice order" }
    }

    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to record invoice order"
    return { ok: false as const, reason: message }
  }
}
