export const PAYMENT_SESSION_KEY = "tetrava_payment_session_v1"
export const PAYMENT_LOCK_MINUTES = 15

export type PaymentSession = {
  orderId: string
  displayId?: string
  totalUsd: number
  lockedUsdc: number
  providerUrl: string
  provider: string
  cryptoAsset: string
  expiresAt: number
  createdAt: number
}

export function usdcFromUsd(usd: number) {
  return Math.round(usd * 100) / 100
}

export function createPaymentSession(input: Omit<PaymentSession, "expiresAt" | "createdAt" | "lockedUsdc"> & {
  lockedUsdc?: number
}): PaymentSession {
  const createdAt = Date.now()
  return {
    ...input,
    lockedUsdc: input.lockedUsdc ?? usdcFromUsd(input.totalUsd),
    createdAt,
    expiresAt: createdAt + PAYMENT_LOCK_MINUTES * 60 * 1000
  }
}

export function savePaymentSession(session: PaymentSession) {
  if (typeof window === "undefined") return
  localStorage.setItem(PAYMENT_SESSION_KEY, JSON.stringify(session))
}

export function loadPaymentSession(orderId?: string): PaymentSession | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(PAYMENT_SESSION_KEY)
  if (!raw) return null
  try {
    const session = JSON.parse(raw) as PaymentSession
    if (orderId && session.orderId !== orderId) return null
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(PAYMENT_SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function clearPaymentSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(PAYMENT_SESSION_KEY)
}

export function remainingMs(session: PaymentSession) {
  return Math.max(0, session.expiresAt - Date.now())
}

export function formatCountdown(ms: number) {
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}:${sec.toString().padStart(2, "0")}`
}
