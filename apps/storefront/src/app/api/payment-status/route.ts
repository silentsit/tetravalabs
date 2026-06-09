import { NextResponse } from "next/server"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(req: Request) {
  const orderId = new URL(req.url).searchParams.get("order_id")?.trim()
  if (!orderId) {
    return NextResponse.json({ ok: false, message: "order_id is required" }, { status: 400 })
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

    if (response.status === 404) {
      return NextResponse.json({ ok: false, message: "Payment intent not found" }, { status: 404 })
    }

    if (!response.ok) {
      const text = await response.text()
      return NextResponse.json(
        { ok: false, message: text || "Unable to load payment status" },
        { status: 502 }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      ok: true,
      order_id: data.order_id,
      status: data.status,
      provider: data.provider,
      provider_url: data.provider_url,
      amount_usd: data.amount_usd,
      currency: data.currency
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment status unavailable"
    return NextResponse.json({ ok: false, message }, { status: 503 })
  }
}
