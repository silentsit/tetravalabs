const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type CardToUsdtIntentResult = {
  ok: boolean
  provider?: string
  provider_url?: string
  amount_usd?: number
  currency?: string
  request_id?: string | null
  reused?: boolean
  message?: string
}

export async function createCardToUsdtPaymentIntent(input: {
  orderId: string
  email: string
  amountUsd: number
  currency?: string
}): Promise<CardToUsdtIntentResult | null> {
  if (!PUBLISHABLE_KEY) return null

  try {
    const response = await fetch(`${MEDUSA_URL}/store/payments/cardtousdt-intent`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: input.orderId,
        email: input.email,
        amount_usd: input.amountUsd,
        currency: input.currency || "USD"
      }),
      cache: "no-store"
    })

    const rawText = await response.text()
    let data: CardToUsdtIntentResult
    try {
      data = JSON.parse(rawText) as CardToUsdtIntentResult
    } catch {
      return {
        ok: false,
        message: rawText.slice(0, 200) || `Card checkout failed (${response.status})`
      }
    }

    if (!response.ok || data.ok === false) {
      return {
        ok: false,
        message: data.message || `Card checkout failed (${response.status})`
      }
    }

    return data
  } catch {
    return null
  }
}
