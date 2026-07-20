const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const SESSION_KEY = "tetrava_checkout_session_id"

export type CheckoutAbandonItem = {
  title: string
  variantTitle?: string
  quantity: number
  unitPrice: number
  handle?: string
}

export function getOrCreateCheckoutSessionId() {
  if (typeof window === "undefined") return ""
  const existing = window.sessionStorage.getItem(SESSION_KEY)
  if (existing) return existing
  const created =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  window.sessionStorage.setItem(SESSION_KEY, created)
  return created
}

export function clearCheckoutSessionId() {
  if (typeof window === "undefined") return
  window.sessionStorage.removeItem(SESSION_KEY)
}

async function postAbandon(body: Record<string, unknown>) {
  if (!PUBLISHABLE_KEY) return { ok: false as const }

  try {
    const response = await fetch(`${MEDUSA_URL}/store/checkout/abandon-schedule`, {
      method: "POST",
      headers: {
        "x-publishable-api-key": PUBLISHABLE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
      cache: "no-store"
    })
    if (!response.ok) return { ok: false as const }
    return { ok: true as const }
  } catch {
    return { ok: false as const }
  }
}

export async function scheduleCheckoutAbandonIntent(input: {
  email: string
  items: CheckoutAbandonItem[]
  subtotalUsd: number
}) {
  const sessionId = getOrCreateCheckoutSessionId()
  if (!sessionId || !input.email.trim() || !input.items.length) {
    return { ok: false as const }
  }

  return postAbandon({
    action: "schedule",
    session_id: sessionId,
    email: input.email.trim(),
    items: input.items,
    subtotal_usd: input.subtotalUsd
  })
}

export async function cancelCheckoutAbandonIntent() {
  const sessionId =
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(SESSION_KEY) || ""
  if (!sessionId) return { ok: false as const }

  const result = await postAbandon({
    action: "cancel",
    session_id: sessionId
  })
  clearCheckoutSessionId()
  return result
}
