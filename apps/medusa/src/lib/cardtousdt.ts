import { createHmac, randomBytes, timingSafeEqual } from "node:crypto"

const CREATE_URL = "https://api.cardtousdt.to/v2/checkout"
const PRICE_BASE = "https://api.cardtousdt.to/crypto"

export const CARDTOUSDT_PROVIDER = "cardtousdt" as const

export const CARDTOUSDT_USD_STABLES = [
  "polygon_usdc",
  "erc20_usdc",
  "erc20_usdt",
  "erc20_pyusd"
] as const

const PAYOUT_RE = /^0x[0-9a-fA-F]{40}$/
const ORDER_ID_RE = /^[^\x00-\x1F\x7F]{1,128}$/
const COIN_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/i
const DEFAULT_BAND = 0.8

export type CardToUsdtCreateInput = {
  orderId: string
  email: string
  amount: number
  currency?: string
}

export type CardToUsdtCreateSuccess = {
  ok: true
  checkout_url: string
  deposit_address: string | null
  amount: number
  currency: string
  amount_usd: number
  order_id: string
  webhook_secret: string | null
  fallback_secret: string
  created_at: string
  request_id: string | null
  reused: boolean
}

export type CardToUsdtCreateFailure = {
  ok: false
  message: string
  code?: string
  request_id?: string | null
}

export type CardToUsdtCreateResult = CardToUsdtCreateSuccess | CardToUsdtCreateFailure

export type CardToUsdtWebhookFields = {
  order_id: string
  secret: string
  txid_out: string
  value_coin: string
  coin: string
  c2t_ts: string
  c2t_sig: string
}

export function normalizePayoutAddress(value: string | undefined) {
  const address = (value || "").trim()
  return PAYOUT_RE.test(address) ? address : ""
}

export function getCardToUsdtPayoutAddress() {
  return normalizePayoutAddress(process.env.CARDTOUSDT_PAYOUT_ADDRESS)
}

export function getCardToUsdtFulfillBand() {
  const raw = Number(process.env.CARDTOUSDT_FULFILL_BAND)
  if (!Number.isFinite(raw)) return DEFAULT_BAND
  return Math.min(1, Math.max(0.5, raw))
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/$/, "")
}

function isPublicHttpsHostname(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== "https:") return false
    if (url.username || url.password) return false
    const host = url.hostname.toLowerCase()
    if (host === "localhost" || host.endsWith(".localhost")) return false
    if (host === "cardtousdt.to" || host.endsWith(".cardtousdt.to")) return false
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return false
    if (host.includes(":")) return false
    return Boolean(host)
  } catch {
    return false
  }
}

export function getCardToUsdtWebhookBase() {
  const override = (process.env.CARDTOUSDT_WEBHOOK_BASE_URL || "").trim()
  if (override) {
    const base = stripTrailingSlash(override)
    return isPublicHttpsHostname(base) ? base : ""
  }

  const publicUrl = stripTrailingSlash((process.env.MEDUSA_PUBLIC_URL || "").trim())
  if (!publicUrl) return ""
  const webhook = `${publicUrl}/webhooks/payments/cardtousdt`
  return isPublicHttpsHostname(webhook) ? webhook : ""
}

export function isCardToUsdtConfigured() {
  return Boolean(getCardToUsdtPayoutAddress() && getCardToUsdtWebhookBase())
}

export function buildCardToUsdtWebhookUrl(orderId: string, secret: string) {
  const base = getCardToUsdtWebhookBase()
  if (!base) return ""
  const url = new URL(base)
  url.searchParams.set("order_id", orderId)
  url.searchParams.set("secret", secret)
  return url.toString()
}

export function newCardToUsdtFallbackSecret() {
  return randomBytes(24).toString("hex")
}

export type CardToUsdtErrorBody = {
  error?: {
    code?: string
    message?: string
    field?: string
    request_id?: string
  }
}

function headerValue(headers: Headers, name: string) {
  return headers.get(name) || headers.get(name.toLowerCase()) || ""
}

async function postCheckout(body: Record<string, unknown>) {
  const response = await fetch(CREATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(20000)
  })

  const requestId = headerValue(response.headers, "X-Request-Id") || null
  const text = await response.text()
  let json: Record<string, unknown> = {}
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {}
  } catch {
    return {
      ok: false as const,
      status: response.status,
      requestId,
      json: {},
      message: text.slice(0, 200) || `CardToUSDT create failed (${response.status})`
    }
  }

  return { ok: response.ok, status: response.status, requestId, json, message: "" }
}

function createErrorMessage(json: Record<string, unknown>, fallback: string) {
  const error = json.error as CardToUsdtErrorBody["error"] | undefined
  if (error?.message) return error.message
  if (typeof json.message === "string" && json.message.trim()) return json.message
  return fallback
}

export async function cardToUsdtCreateCheckout(
  input: CardToUsdtCreateInput
): Promise<CardToUsdtCreateResult> {
  const payoutAddress = getCardToUsdtPayoutAddress()
  const orderId = input.orderId.trim()
  const email = input.email.trim()
  const amount = Number(input.amount)
  const currency = (input.currency || "USD").trim().toUpperCase() || "USD"

  if (!payoutAddress) {
    return { ok: false, message: "CARDTOUSDT_PAYOUT_ADDRESS is missing or not a 0x wallet" }
  }
  if (!ORDER_ID_RE.test(orderId)) {
    return { ok: false, message: "order_id is invalid" }
  }
  if (!email || email.length > 254 || !email.includes("@")) {
    return { ok: false, message: "buyer_email is invalid" }
  }
  if (!Number.isFinite(amount) || amount <= 0 || amount > 1_000_000) {
    return { ok: false, message: "amount must be greater than 0 and at most 1000000" }
  }

  const fallbackSecret = newCardToUsdtFallbackSecret()
  const webhookUrl = buildCardToUsdtWebhookUrl(orderId, fallbackSecret)
  if (!webhookUrl) {
    return {
      ok: false,
      message:
        "CardToUSDT webhook URL must be a public HTTPS hostname. Set MEDUSA_PUBLIC_URL or CARDTOUSDT_WEBHOOK_BASE_URL."
    }
  }

  const body = {
    payout_address: payoutAddress,
    amount,
    currency,
    buyer_email: email,
    order_id: orderId,
    webhook_url: webhookUrl
  }

  const first = await postCheckout(body)
  const retryable = !first.ok && (first.json.error as CardToUsdtErrorBody["error"] | undefined)?.code === "conversion_failed"
  const result = retryable ? await postCheckout(body) : first

  if (!result.ok) {
    const error = result.json.error as CardToUsdtErrorBody["error"] | undefined
    return {
      ok: false,
      message: result.message || createErrorMessage(result.json, "CardToUSDT could not create checkout"),
      code: error?.code,
      request_id: error?.request_id || result.requestId
    }
  }

  const checkoutUrl = typeof result.json.checkout_url === "string" ? result.json.checkout_url.trim() : ""
  if (!checkoutUrl) {
    return {
      ok: false,
      message: "CardToUSDT returned no checkout_url",
      request_id: result.requestId
    }
  }

  const amountUsd = Number(result.json.amount_usd)
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return {
      ok: false,
      message: "CardToUSDT returned no amount_usd",
      request_id: result.requestId
    }
  }

  const webhookSecret =
    typeof result.json.webhook_secret === "string" && result.json.webhook_secret.trim()
      ? result.json.webhook_secret.trim()
      : null

  return {
    ok: true,
    checkout_url: checkoutUrl,
    deposit_address:
      typeof result.json.deposit_address === "string" && result.json.deposit_address.trim()
        ? result.json.deposit_address.trim()
        : null,
    amount: Number(result.json.amount) || amount,
    currency: typeof result.json.currency === "string" ? result.json.currency : currency,
    amount_usd: amountUsd,
    order_id: typeof result.json.order_id === "string" ? result.json.order_id : orderId,
    webhook_secret: webhookSecret,
    created_at: typeof result.json.created_at === "string" ? result.json.created_at : new Date().toISOString(),
    request_id: result.requestId,
    reused: false,
    fallback_secret: fallbackSecret
  }
}

export function queryParam(value: unknown): string {
  if (typeof value === "string") return value
  if (Array.isArray(value) && typeof value[0] === "string") return value[0]
  return ""
}

export function readCardToUsdtWebhookFields(
  query: Record<string, unknown>,
  headers: Record<string, unknown>
): CardToUsdtWebhookFields {
  const headerMap = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), queryParam(value)])
  )

  return {
    order_id: queryParam(query.order_id),
    secret: queryParam(query.secret),
    txid_out: queryParam(query.txid_out),
    value_coin: queryParam(query.value_coin),
    coin: queryParam(query.coin),
    c2t_ts: queryParam(query.c2t_ts) || headerMap["x-c2t-timestamp"] || "",
    c2t_sig: queryParam(query.c2t_sig) || headerMap["x-c2t-signature"] || ""
  }
}

export function verifyCardToUsdtSignature(input: {
  webhookSecret: string
  ts: string
  txidOut: string
  valueCoin: string
  coin: string
  signatureHeader: string
}) {
  const canonical = ["c2t1", input.ts, input.txidOut, input.valueCoin, input.coin].join("\n")
  const expected = createHmac("sha256", input.webhookSecret).update(canonical, "utf8").digest("hex")
  const expectedBuf = Buffer.from(expected, "utf8")

  for (const candidate of input.signatureHeader.split(",")) {
    const trimmed = candidate.trim()
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const version = trimmed.slice(0, eq)
    const value = trimmed.slice(eq + 1)
    if (version !== "v1" || !value) continue
    const got = Buffer.from(value, "utf8")
    if (got.length === expectedBuf.length && timingSafeEqual(got, expectedBuf)) {
      return true
    }
  }

  return false
}

export function secretsMatch(expected: string, received: string) {
  const a = Buffer.from(expected, "utf8")
  const b = Buffer.from(received, "utf8")
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function cardToUsdtPaidUsd(valueCoin: string, coin: string): Promise<number | null> {
  const amount = Number(valueCoin)
  if (!Number.isFinite(amount) || amount < 0) return null

  const normalized = coin.trim().toLowerCase()
  if ((CARDTOUSDT_USD_STABLES as readonly string[]).includes(normalized)) {
    return amount
  }

  if (!COIN_RE.test(normalized)) return null

  const path = normalized.replace(/_/g, "/")
  try {
    const response = await fetch(`${PRICE_BASE}/${path}/info.php`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    })
    if (!response.ok) return null
    const info = (await response.json()) as { prices?: { USD?: unknown } }
    const usd = Number(info?.prices?.USD)
    if (!Number.isFinite(usd) || usd <= 0) return null
    return amount * usd
  } catch {
    return null
  }
}

export function isCardToUsdtTimestampFresh(ts: string, nowSeconds = Math.floor(Date.now() / 1000)) {
  const parsed = Number.parseInt(ts, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return false
  return Math.abs(nowSeconds - parsed) <= 300
}
