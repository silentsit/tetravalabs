import { NextResponse } from "next/server"
import { loadCheckoutPaymentOptions } from "@/lib/checkout-payment-options"
import { getMedusaStoreHeaders } from "@/lib/medusa-headers"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")

export async function GET() {
  const options = await loadCheckoutPaymentOptions(fetch, MEDUSA_URL, getMedusaStoreHeaders())

  return NextResponse.json(
    { ok: true, ...options },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}
