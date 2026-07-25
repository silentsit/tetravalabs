import { readAuthToken } from "@/lib/medusa-auth"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(
  /\/$/,
  ""
)
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type AccountRestock = {
  id: string
  status: string
  handle: string
  title: string
  variantTitle: string | null
  quantity: number
  unitPriceUsd: number
  oneTimeUnitPriceUsd: number
  cadenceDays: number
  discountPct: number
  nextBillingAt: string | null
  pausedAt: string | null
  cancelledAt: string | null
  latestOrderId: string | null
  createdAt: string
}

function authHeaders(): HeadersInit {
  const token = readAuthToken()
  return {
    "content-type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
    ...(token ? { authorization: `Bearer ${token}` } : {})
  }
}

export async function fetchAccountRestocks(): Promise<AccountRestock[]> {
  const response = await fetch(`${MEDUSA_URL}/store/lab-restocks`, {
    headers: authHeaders(),
    cache: "no-store"
  })
  if (!response.ok) return []
  const data = await response.json()
  return Array.isArray(data?.restocks) ? data.restocks : []
}

export async function mutateAccountRestock(
  id: string,
  action: "pause" | "resume" | "cancel" | "skip" | "set_cadence" | "pay_now",
  cadenceDays?: number
): Promise<{ ok: boolean; message?: string; payment_url?: string }> {
  const response = await fetch(`${MEDUSA_URL}/store/lab-restocks/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ action, cadenceDays }),
    cache: "no-store"
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok || data?.ok === false) {
    return { ok: false, message: data?.message || "Request failed" }
  }
  return {
    ok: true,
    payment_url: typeof data.payment_url === "string" ? data.payment_url : undefined
  }
}
