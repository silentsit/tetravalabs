import { NextResponse } from "next/server"
import { sendOrderConfirmationEmail } from "@/lib/send-order-confirmation"

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

  const paymentUrl = await resolvePaymentUrl(orderId, payload.paymentUrl)
  const items = (payload.items || [])
    .filter((item) => item.title && item.quantity && item.unitPrice != null)
    .map((item) => ({
      title: item.title!,
      variantTitle: item.variantTitle,
      quantity: item.quantity!,
      unitPrice: item.unitPrice!
    }))

  const result = await sendOrderConfirmationEmail({
    email,
    orderId,
    displayId,
    total,
    paymentUrl,
    items
  })

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 })
  }

  if (result.skipped) {
    return NextResponse.json({ ok: true, skipped: result.skipped })
  }

  return NextResponse.json({ ok: true, emailed: result.emailed })
}
