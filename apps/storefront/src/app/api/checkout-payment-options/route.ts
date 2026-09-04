import { NextResponse } from "next/server"
import { loadCheckoutPaymentOptions } from "@/lib/checkout-payment-options"
import { getMedusaStoreHeaders } from "@/lib/medusa-headers"
import { loadPeptidepayLiveOnrampStatuses } from "@/lib/peptidepay-live-providers"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")

export async function GET() {
  const [options, cardOnrampStatus] = await Promise.all([
    loadCheckoutPaymentOptions(fetch, MEDUSA_URL, getMedusaStoreHeaders()),
    loadPeptidepayLiveOnrampStatuses()
  ])

  return NextResponse.json(
    { ok: true, ...options, cardOnrampStatus },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  )
}
