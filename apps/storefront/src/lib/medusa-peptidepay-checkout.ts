const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type PeptidepayIntentResult =
  | {
      ok: true
      order_id: string
      provider: "peptidepay"
      provider_url: string
      session_id?: string
      message?: string
    }
  | { ok: false; message?: string }

export async function createPeptidepayPaymentIntent(input: {
  orderId: string
  email: string
  amountUsd: number
  currency?: string
  productName?: string
  provider: string
  country: string
  ipCountry?: string | null
}): Promise<PeptidepayIntentResult | null> {
  if (!PUBLISHABLE_KEY) return null

  try {
    const response = await fetch(`${MEDUSA_URL}/store/payments/peptidepay-intent`, {
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
        product_name: input.productName,
        provider: input.provider,
        country: input.country,
        ip_country: input.ipCountry || undefined
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(25000)
    })

    const rawText = await response.text()
    let data: PeptidepayIntentResult
    try {
      data = JSON.parse(rawText) as PeptidepayIntentResult
    } catch {
      return {
        ok: false,
        message: rawText.slice(0, 200) || `Peptide Pay intent failed (${response.status})`
      }
    }

    if (!response.ok || data.ok === false) {
      return {
        ok: false,
        message: data.message || `Peptide Pay intent failed (${response.status})`
      }
    }

    return data
  } catch (error) {
    const timedOut =
      error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")
    return {
      ok: false,
      message: timedOut
        ? "Peptide Pay did not respond in time. Try again, or choose another card processor."
        : "Could not reach Peptide Pay."
    }
  }
}
