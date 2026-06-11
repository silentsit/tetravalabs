import { buildOrderConfirmationEmail } from "@/lib/order-confirmation-email"

export type OrderEmailItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
}

export type SendOrderConfirmationInput = {
  email: string
  orderId: string
  displayId?: number
  total: number
  paymentUrl?: string | null
  items?: OrderEmailItem[]
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")

function buildPaymentPageUrl(orderId: string, displayId?: number, total?: number) {
  const params = new URLSearchParams({ order_id: orderId })
  if (displayId) params.set("display_id", String(displayId))
  if (typeof total === "number" && total > 0) params.set("total", total.toFixed(2))
  return `${SITE_URL}/checkout/payment?${params.toString()}`
}

export async function sendOrderConfirmationEmail(
  input: SendOrderConfirmationInput
): Promise<{ ok: true; emailed: boolean; skipped?: string } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"

  if (!apiKey) {
    return { ok: true, emailed: false, skipped: "RESEND_API_KEY not configured" }
  }

  const orderLabel = input.displayId ? `Order #${input.displayId}` : input.orderId
  const paymentPageUrl = buildPaymentPageUrl(input.orderId, input.displayId, input.total)

  const { subject, html } = buildOrderConfirmationEmail({
    orderLabel,
    total: input.total,
    paymentUrl: input.paymentUrl,
    paymentPageUrl,
    items: input.items || []
  })

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject,
      html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return { ok: false, error }
  }

  return { ok: true, emailed: true }
}
