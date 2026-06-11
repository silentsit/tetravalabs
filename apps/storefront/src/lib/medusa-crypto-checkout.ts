const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type CryptoIntentResult = {
  ok: boolean
  provider?: string
  provider_url?: string
  crypto_asset?: string
  message?: string
}

export async function createCryptoPaymentIntent(input: {
  orderId: string
  email: string
  amountUsd: number
  currency?: string
  cryptoAsset?: string
}): Promise<CryptoIntentResult | null> {
  if (!PUBLISHABLE_KEY) return null

  try {
    const response = await fetch(`${MEDUSA_URL}/store/payments/crypto-intent`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: input.orderId,
        email: input.email,
        amount_usd: input.amountUsd,
        currency: input.currency || "USD",
        crypto_asset: input.cryptoAsset || "BTC"
      }),
      cache: "no-store"
    })

    const data = (await response.json()) as CryptoIntentResult
    if (!response.ok || !data.ok) {
      return { ok: false, message: data.message || `Crypto intent failed (${response.status})` }
    }
    return data
  } catch {
    return null
  }
}
