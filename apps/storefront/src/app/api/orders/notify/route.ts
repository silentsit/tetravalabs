import { NextResponse } from "next/server"
import { buildOrderConfirmationEmail } from "@/lib/order-confirmation-email"

type OrderItem = {
  title?: string
  variantTitle?: string
  quantity?: number
  unitPrice?: number
}

type Body = {
  email?: string
  orderId?: string
  displayId?: number
  total?: number
  paymentUrl?: string
  items?: OrderItem[]
}

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")

function buildPaymentPageUrl(orderId: string, displayId?: number, total?: number) {
  const params = new URLSearchParams({ order_id: orderId })
  if (displayId) params.set("display_id", String(displayId))
  if (typeof total === "number" && total > 0) params.set("total", total.toFixed(2))
  return `${SITE_URL}/checkout/payment?${params.toString()}`
}

async function resolvePaymentUrl(orderId: string, provided?: string) {
  if (provided && !provided.includes("example.com")) {
    return provided
  }

  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/payments/crypto-intent?order_id=${encodeURIComponent(orderId)}`,
      {
        headers: {
          ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
        },
        cache: "no-store"
      }
    )
    if (!response.ok) return provided || null
    const data = await response.json()
    return data.provider_url || provided || null
  } catch {
    return provided || null
  }
}

export async function POST(req: Request) {
  const payload = (await req.json()) as Body
  const email = payload.email?.trim()
  const orderId = payload.orderId?.trim()
  const displayId = payload.displayId
  const total = Number(payload.total || 0)

  if (!email || !orderId) {
    return NextResponse.json({ ok: false, message: "email and orderId are required" }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) {
    return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY not configured" })
  }

  const paymentUrl = await resolvePaymentUrl(orderId, payload.paymentUrl)
  const paymentPageUrl = buildPaymentPageUrl(orderId, displayId, total)
  const orderLabel = displayId ? `Order #${displayId}` : orderId

  const items = (payload.items || [])
    .filter((item) => item.title && item.quantity && item.unitPrice != null)
    .map((item) => ({
      title: item.title!,
      variantTitle: item.variantTitle,
      quantity: item.quantity!,
      unitPrice: item.unitPrice!
    }))

  const { subject, html } = buildOrderConfirmationEmail({
    orderLabel,
    total,
    paymentUrl,
    paymentPageUrl,
    items
  })

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      html
    })
  })

  if (!response.ok) {
    const error = await response.text()
    return NextResponse.json({ ok: false, error }, { status: 502 })
  }

  return NextResponse.json({ ok: true, emailed: true })
}
