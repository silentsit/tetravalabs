import { createHmac, randomUUID, timingSafeEqual } from "node:crypto"
import { getHeaderValue } from "./webhook-raw-body"

const API_BASE = "https://peptide-pay.com/api/v1"

export type PeptidepayCheckoutInput = {
  orderId: string
  email: string
  amountUsd: number
  currency?: string
  productName?: string
  successUrl?: string
  cancelUrl?: string
}

export type PeptidepayCheckoutSession = {
  id: string
  url: string
  status: string
  tracking_number?: string
}

export type PeptidepayWebhookEvent = {
  event?: string
  session_id?: string
  order_id?: string
  address_in?: string
  status?: string
  amount?: number
  currency?: string
  txid?: string
  paid_at?: string
  attempt?: number
}

export function isPeptidepayConfigured(): boolean {
  return Boolean(process.env.PEPTIDEPAY_API_KEY?.trim())
}

function getStorefrontOrigin() {
  return (
    process.env.STOREFRONT_URL?.trim() ||
    process.env.STORE_CORS?.split(",")[0]?.trim() ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

function getMedusaPublicOrigin() {
  return (
    process.env.MEDUSA_PUBLIC_URL?.trim() ||
    process.env.PEPTIDEPAY_WEBHOOK_BASE_URL?.trim() ||
    "http://localhost:9000"
  ).replace(/\/$/, "")
}

function getApiKey() {
  return process.env.PEPTIDEPAY_API_KEY?.trim() || ""
}

export function peptidepayWebhookUrl() {
  return `${getMedusaPublicOrigin()}/webhooks/payments/peptidepay`
}

export async function createPeptidepayCheckoutSession(
  input: PeptidepayCheckoutInput
): Promise<{ ok: true; session: PeptidepayCheckoutSession } | { ok: false; error: string }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return { ok: false, error: "PEPTIDEPAY_API_KEY is not configured" }
  }

  const amountCents = Math.round(input.amountUsd * 100)
  if (amountCents < 100) {
    return { ok: false, error: "Order total must be at least $1.00" }
  }

  const storefront = getStorefrontOrigin()
  const currency = (input.currency || "USD").toUpperCase()
  const productName = (input.productName || "Tetrava Labs order").slice(0, 80)

  try {
    const response = await fetch(`${API_BASE}/checkout/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": randomUUID()
      },
      body: JSON.stringify({
        amount_cents: amountCents,
        currency,
        customer_email: input.email,
        success_url:
          input.successUrl ||
          `${storefront}/checkout/success?order_id=${encodeURIComponent(input.orderId)}`,
        cancel_url: input.cancelUrl || `${storefront}/checkout`,
        webhook_url: peptidepayWebhookUrl(),
        product_name: productName,
        provider: "gateway",
        metadata: { order_id: input.orderId }
      })
    })

    const rawText = await response.text()
    let data: Record<string, unknown> | null = null
    try {
      data = JSON.parse(rawText) as Record<string, unknown>
    } catch {
      return { ok: false, error: rawText.slice(0, 200) || `Peptide Pay error (${response.status})` }
    }

    if (!response.ok) {
      const message =
        (typeof data?.message === "string" && data.message) ||
        (typeof data?.error === "string" && data.error) ||
        `Peptide Pay checkout failed (${response.status})`
      return { ok: false, error: message }
    }

    const id = typeof data.id === "string" ? data.id : ""
    const url = typeof data.url === "string" ? data.url : ""
    const status = typeof data.status === "string" ? data.status : "pending"

    if (!id || !url) {
      return { ok: false, error: "Peptide Pay returned an incomplete session" }
    }

    return {
      ok: true,
      session: {
        id,
        url,
        status,
        tracking_number:
          typeof data.tracking_number === "string" ? data.tracking_number : undefined
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Peptide Pay request failed"
    return { ok: false, error: message }
  }
}

export function verifyPeptidepayWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secret: string
): boolean {
  if (!signatureHeader?.trim() || !secret.trim()) return false

  const parts = signatureHeader.split(",")
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2)
  const v1 = parts.find((part) => part.startsWith("v1="))?.slice(3)

  if (!timestamp || !v1) return false

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp))
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")

  try {
    const received = Buffer.from(v1, "hex")
    const expectedBuffer = Buffer.from(expected, "hex")
    if (received.length !== expectedBuffer.length) return false
    return timingSafeEqual(received, expectedBuffer)
  } catch {
    return false
  }
}

export function getPeptidepaySignatureHeader(headers: Record<string, unknown>) {
  return getHeaderValue(headers, "x-peptidepay-signature")
}

export function parsePeptidepayWebhookEvent(rawBody: string): PeptidepayWebhookEvent | null {
  try {
    return JSON.parse(rawBody) as PeptidepayWebhookEvent
  } catch {
    return null
  }
}
