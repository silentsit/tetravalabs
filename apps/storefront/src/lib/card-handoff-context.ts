import { isPeptidepayOnrampId, type PeptidepayOnrampId } from "@/lib/peptidepay-onramps"

const handoffContextKey = (orderId: string) => `tetrava_handoff_ctx_${orderId}`

export type CardHandoffContext = {
  email: string
  country: string
  amountUsd: number
  provider: PeptidepayOnrampId
  fallbackUrl?: string
}

export function storeCardHandoffContext(orderId: string, context: CardHandoffContext) {
  if (typeof window === "undefined" || !orderId) return
  sessionStorage.setItem(handoffContextKey(orderId), JSON.stringify(context))
}

export function readCardHandoffContext(orderId: string): CardHandoffContext | null {
  if (typeof window === "undefined" || !orderId) return null
  const raw = sessionStorage.getItem(handoffContextKey(orderId))
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CardHandoffContext
    if (
      typeof parsed.email !== "string" ||
      typeof parsed.country !== "string" ||
      typeof parsed.amountUsd !== "number" ||
      !isPeptidepayOnrampId(parsed.provider)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}
