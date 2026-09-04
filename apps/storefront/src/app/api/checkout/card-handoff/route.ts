import { NextResponse } from "next/server"
import { createPeptidepayPaymentIntent } from "@/lib/medusa-peptidepay-checkout"
import {
  loadPeptidepayLiveOnrampStatuses,
  peptidepayLiveIdSet
} from "@/lib/peptidepay-live-providers"
import {
  isPeptidepayOnrampId,
  peptidepayBuyerIpCountry,
  resolvePeptidepayOnramp
} from "@/lib/peptidepay-onramps"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

type Body = {
  order_id?: string
  provider?: string
  country?: string
  email?: string
  amount_usd?: number
}

async function loadIntent(orderId: string) {
  const response = await fetch(
    `${MEDUSA_URL}/store/payments/crypto-intent?order_id=${encodeURIComponent(orderId)}`,
    {
      headers: {
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
      },
      cache: "no-store"
    }
  )

  if (!response.ok) return null
  const data = await response.json()
  if (!data?.ok) return null
  return data as {
    order_id: string
    amount_usd: number
    currency?: string
    status?: string
  }
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 })
  }

  const orderId = body.order_id?.trim()
  const provider = body.provider?.trim().toLowerCase() || ""
  const country = body.country?.trim().toUpperCase() || "US"

  if (!orderId) {
    return NextResponse.json({ ok: false, message: "order_id is required." }, { status: 400 })
  }
  if (!isPeptidepayOnrampId(provider)) {
    return NextResponse.json({ ok: false, message: "Choose a supported card processor." }, { status: 400 })
  }

  const intent = await loadIntent(orderId)
  if (intent?.status === "paid" || intent?.status === "completed" || intent?.status === "settled") {
    return NextResponse.json({ ok: false, message: "This order is already paid." }, { status: 409 })
  }

  const amountFromBody = Number(body.amount_usd)
  const amountUsd = Number.isFinite(amountFromBody) && amountFromBody > 0
    ? amountFromBody
    : Number(intent?.amount_usd)
  const email = body.email?.trim() || ""

  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json({ ok: false, message: "Order total is invalid." }, { status: 400 })
  }

  if (!intent && !email) {
    return NextResponse.json(
      { ok: false, message: "Order payment record not found. Return to checkout and try again." },
      { status: 404 }
    )
  }

  const ipCountry = peptidepayBuyerIpCountry(
    req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("x-country-code")
  )

  const liveIds = peptidepayLiveIdSet(await loadPeptidepayLiveOnrampStatuses())
  const onramp = resolvePeptidepayOnramp({
    requested: provider,
    country,
    amountUsd,
    ipCountry,
    liveIds
  })
  if (!onramp.ok) {
    return NextResponse.json({ ok: false, message: onramp.error }, { status: 400 })
  }

  const mintSession = async () =>
    createPeptidepayPaymentIntent({
      orderId,
      email: email || undefined,
      amountUsd,
      currency: intent?.currency || "USD",
      provider: onramp.provider,
      country,
      ipCountry
    })

  let session = await mintSession()
  if (!session || session.ok === false) {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    session = await mintSession()
  }

  if (!session || session.ok === false) {
    return NextResponse.json(
      { ok: false, message: session?.message || "Could not open card checkout. Try again in a moment." },
      { status: 502 }
    )
  }

  const sessionOnramp = session.session_onramp?.trim().toLowerCase() || ""
  if (
    sessionOnramp &&
    sessionOnramp !== onramp.provider &&
    (sessionOnramp === "gateway" || isPeptidepayOnrampId(sessionOnramp))
  ) {
    return NextResponse.json(
      {
        ok: false,
        message: `Peptide Pay assigned ${sessionOnramp} instead of ${onramp.provider}. Try Pay Now again or choose ${sessionOnramp} at checkout.`,
        session_onramp: sessionOnramp,
        requested_onramp: onramp.provider
      },
      { status: 502 }
    )
  }

  return NextResponse.json({
    ok: true,
    order_id: orderId,
    provider_url: session.provider_url,
    session_id: session.session_id,
    card_onramp: onramp.provider,
    session_onramp: sessionOnramp || onramp.provider,
    requested_onramp: onramp.provider,
    used_fallback: false
  })
}
