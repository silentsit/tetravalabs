import crypto from "node:crypto"

type CreateInvoiceInput = {
  orderId: string
  email: string
  amountUsd: number
  currency: string
}

type BtcpayInvoiceResult = {
  invoiceId: string
  checkoutUrl: string
}

export function isBtcpayConfigured() {
  const baseUrl = process.env.BTCPAY_URL || process.env.CRYPTO_API_URL
  return Boolean(baseUrl && process.env.BTCPAY_API_KEY && process.env.BTCPAY_STORE_ID)
}

function getBtcpayConfig() {
  const baseUrl = (process.env.BTCPAY_URL || process.env.CRYPTO_API_URL || "").replace(/\/$/, "")
  const apiKey = process.env.BTCPAY_API_KEY
  const storeId = process.env.BTCPAY_STORE_ID

  if (!baseUrl || !apiKey || !storeId) {
    throw new Error("BTCPay is not configured")
  }

  return { baseUrl, apiKey, storeId }
}

function getRedirectUrl() {
  const storeOrigin =
    process.env.STOREFRONT_URL ||
    process.env.STORE_CORS?.split(",")[0]?.trim() ||
    "http://localhost:3000"
  return `${storeOrigin.replace(/\/$/, "")}/orders?payment=complete`
}

export async function createBtcpayInvoice(input: CreateInvoiceInput): Promise<BtcpayInvoiceResult> {
  const { baseUrl, apiKey, storeId } = getBtcpayConfig()

  const response = await fetch(`${baseUrl}/api/v1/stores/${storeId}/invoices`, {
    method: "POST",
    headers: {
      Authorization: `token ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: input.amountUsd.toFixed(2),
      currency: input.currency,
      metadata: {
        orderId: input.orderId,
        buyerEmail: input.email
      },
      checkout: {
        redirectURL: getRedirectUrl(),
        redirectAutomatically: true
      }
    })
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`BTCPay invoice failed (${response.status}): ${text}`)
  }

  const invoice = JSON.parse(text) as {
    id?: string
    checkoutLink?: string
    url?: string
  }

  const checkoutUrl = invoice.checkoutLink || invoice.url
  if (!invoice.id || !checkoutUrl) {
    throw new Error("BTCPay response missing invoice id or checkout URL")
  }

  return { invoiceId: invoice.id, checkoutUrl }
}

export async function fetchBtcpayInvoice(invoiceId: string) {
  const { baseUrl, apiKey, storeId } = getBtcpayConfig()
  const response = await fetch(`${baseUrl}/api/v1/stores/${storeId}/invoices/${invoiceId}`, {
    headers: { Authorization: `token ${apiKey}` }
  })
  if (!response.ok) return null
  return response.json() as Promise<{ metadata?: Record<string, string>; status?: string }>
}

export function verifyBtcpayWebhookSignature(rawBody: string, signatureHeader: string | undefined) {
  const secret = process.env.BTCPAY_WEBHOOK_SECRET || process.env.CRYPTO_WEBHOOK_SECRET
  if (!secret) {
    return process.env.NODE_ENV !== "production"
  }
  if (!signatureHeader) return false

  const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`

  if (expected.length !== signatureHeader.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
}

export function mapBtcpayEventType(eventType: string) {
  switch (eventType) {
    case "InvoiceSettled":
    case "InvoicePaymentSettled":
      return "completed"
    case "InvoiceExpired":
      return "expired"
    case "InvoiceInvalid":
    case "InvoicePaymentSettledInvalid":
      return "failed"
    case "InvoiceCreated":
    case "InvoiceReceivedPayment":
    case "InvoiceProcessing":
      return "processing"
    default:
      return "pending"
  }
}
