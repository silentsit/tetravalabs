import { createHmac } from "node:crypto"

const DEFAULT_API = "https://api.paymento.io"
const DEFAULT_GATEWAY = "https://app.paymento.io/gateway"

function apiBase() {
  return (process.env.PAYMENTO_API_BASE || DEFAULT_API).replace(/\/$/, "")
}

export function paymentoGatewayUrl(token: string) {
  const base = (process.env.PAYMENTO_GATEWAY_BASE || DEFAULT_GATEWAY).replace(/\/$/, "")
  return `${base}?token=${encodeURIComponent(token)}`
}

export type PaymentoRequestInput = {
  fiatAmount: string
  fiatCurrency: string
  orderId: string
  returnUrl: string
  speed: 0 | 1
  emailAddress?: string
  additionalData?: { key: string; value: string }[]
}

export type PaymentoRequestResponse = { success: true; token: string } | { success: false; error: string }

export async function paymentoCreatePaymentRequest(
  input: PaymentoRequestInput
): Promise<PaymentoRequestResponse> {
  const key = process.env.PAYMENTO_API_KEY
  if (!key) {
    return { success: false, error: "PAYMENTO_API_KEY is not configured" }
  }

  const response = await fetch(`${apiBase()}/v1/payment/request`, {
    method: "POST",
    headers: {
      "Api-key": key,
      "Content-Type": "application/json",
      Accept: "text/plain"
    },
    body: JSON.stringify({
      fiatAmount: input.fiatAmount,
      fiatCurrency: input.fiatCurrency,
      ReturnUrl: input.returnUrl,
      orderId: input.orderId,
      Speed: input.speed,
      ...(input.emailAddress ? { EmailAddress: input.emailAddress } : {}),
      ...(input.additionalData?.length ? { additionalData: input.additionalData } : {})
    })
  })

  const data = (await response.json()) as {
    success?: boolean
    body?: string
    error?: string
    message?: string
  }
  if (!response.ok) {
    return { success: false, error: data.error ?? data.message ?? response.statusText }
  }
  if (data.success && typeof data.body === "string" && data.body.trim()) {
    return { success: true, token: data.body.trim() }
  }
  return { success: false, error: data.error ?? data.message ?? "Invalid Paymento response" }
}

export async function paymentoVerifyToken(token: string): Promise<{
  ok: boolean
  orderId?: string
  raw: unknown
}> {
  const key = process.env.PAYMENTO_API_KEY
  if (!key) {
    return { ok: false, raw: { error: "no api key" } }
  }

  const response = await fetch(`${apiBase()}/v1/payment/verify`, {
    method: "POST",
    headers: {
      "Api-key": key,
      "Content-Type": "application/json",
      Accept: "text/plain"
    },
    body: JSON.stringify({ token })
  })

  const data = (await response.json()) as {
    success?: boolean
    body?: { orderId?: string; token?: string; additionalData?: unknown }
    error?: string
  }

  if (!response.ok || !data.success) {
    return { ok: false, raw: data }
  }
  return {
    ok: true,
    orderId: data.body?.orderId,
    raw: data
  }
}

export function getPaymentoSpeedFromEnv(): 0 | 1 {
  return process.env.PAYMENTO_SPEED === "0" ? 0 : 1
}

export function isPaymentoConfigured(): boolean {
  return Boolean(process.env.PAYMENTO_API_KEY && process.env.PAYMENTO_SECRET_KEY)
}

const SIGNATURE_HEADER_CANDIDATES = ["x-hmac-sha256-signature", "hmac_sha256_signature"] as const

export function getPaymentoIpnSignatureHeader(headers: Record<string, unknown>): string | null {
  for (const name of SIGNATURE_HEADER_CANDIDATES) {
    const value = headers[name] ?? headers[name.toUpperCase()]
    if (typeof value === "string" && value.trim()) return value
  }
  return null
}

export function verifyPaymentoHmac(
  rawBody: string,
  receivedSignature: string | null,
  secretKey: string
): boolean {
  if (!receivedSignature) return false
  const calculated = createHmac("sha256", secretKey).update(rawBody, "utf8").digest("hex").toUpperCase()
  const expected = receivedSignature.trim().toUpperCase()
  if (calculated.length !== expected.length) return false
  let out = 0
  for (let i = 0; i < calculated.length; i++) {
    out |= calculated.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return out === 0
}

export function mapPaymentoOrderStatus(status: number): string {
  if (status === 7) return "completed"
  if (status === 4) return "expired"
  if (status === 5 || status === 9) return "failed"
  return "pending"
}
