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

export type PaymentoIpnPayload = {
  Token?: string
  PaymentId?: number
  OrderId?: string
  OrderStatus?: number
  AdditionalData?: unknown
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

type PaymentoApiEnvelope = {
  success?: boolean
  body?: string | { orderId?: string; token?: string; additionalData?: unknown }
  error?: string
  message?: string
}

function parsePaymentoApiText(text: string): PaymentoApiEnvelope | null {
  const trimmed = text.trim()
  if (!trimmed) return null
  try {
    return JSON.parse(trimmed) as PaymentoApiEnvelope
  } catch {
    return null
  }
}

function extractPaymentToken(data: PaymentoApiEnvelope | null, rawText: string): string | null {
  if (data?.success && typeof data.body === "string" && data.body.trim()) {
    return data.body.trim()
  }
  if (data?.success && data.body && typeof data.body === "object" && "token" in data.body) {
    const token = (data.body as { token?: string }).token
    if (typeof token === "string" && token.trim()) return token.trim()
  }
  const plain = rawText.trim()
  if (plain && !plain.startsWith("{")) {
    return plain
  }
  return null
}

export async function paymentoCreatePaymentRequest(
  input: PaymentoRequestInput
): Promise<PaymentoRequestResponse> {
  const key = process.env.PAYMENTO_API_KEY
  if (!key) {
    return { success: false, error: "PAYMENTO_API_KEY is not configured" }
  }

  try {
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

    const rawText = await response.text()
    const data = parsePaymentoApiText(rawText)

    if (!response.ok) {
      const detail = data?.error ?? data?.message ?? rawText.slice(0, 200)
      return {
        success: false,
        error: detail || response.statusText
      }
    }

    const token = extractPaymentToken(data, rawText)
    if (token) {
      return { success: true, token }
    }

    return {
      success: false,
      error: data?.error ?? data?.message ?? "Invalid Paymento response"
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Paymento request failed"
    return { success: false, error: message }
  }
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

  const rawText = await response.text()
  const data = parsePaymentoApiText(rawText)

  if (!data) {
    return { ok: false, raw: { error: "invalid response from verify API", rawText: rawText.slice(0, 200) } }
  }

  if (!response.ok || !data.success) {
    return { ok: false, raw: data }
  }

  const body = data.body
  const orderId =
    typeof body === "object" && body && "orderId" in body ? String(body.orderId || "") : undefined

  return {
    ok: true,
    orderId,
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
    for (const [key, value] of Object.entries(headers)) {
      if (key.toLowerCase() !== name.toLowerCase()) continue
      if (typeof value === "string" && value.trim()) return value.trim()
      if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
        return value[0].trim()
      }
    }
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
