export type MintCardCheckoutInput = {
  orderId: string
  provider?: string
  email?: string
  amountUsd: number
  country?: string
}

export async function mintCardCheckoutSession(
  input: MintCardCheckoutInput
): Promise<string | null> {
  if (!input.orderId || !Number.isFinite(input.amountUsd) || input.amountUsd <= 0) {
    return null
  }

  try {
    const response = await fetch("/api/checkout/card-handoff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: input.orderId,
        provider: input.provider || undefined,
        email: input.email || undefined,
        amount_usd: input.amountUsd,
        country: input.country || undefined
      })
    })
    const data = (await response.json()) as { ok?: boolean; provider_url?: string }
    const url = data.provider_url?.trim() || ""
    if (!url || url.includes("example.com")) return null
    return url
  } catch {
    return null
  }
}
