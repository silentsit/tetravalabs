import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  CARDTOUSDT_PROVIDER,
  cardToUsdtCreateCheckout,
  isCardToUsdtConfigured
} from "../../../../lib/cardtousdt"
import { getDbPool } from "../../../../lib/db"

type Body = {
  order_id?: string
  email?: string
  amount_usd?: number
  currency?: string
}

type IntentRow = {
  order_id: string
  email: string
  amount_usd: string | number
  currency: string
  provider_url: string
  status: string
  provider: string
}

async function loadIntent(orderId: string) {
  const db = getDbPool()
  if (!db) return null
  const result = await db.query<IntentRow>(
    `
    SELECT order_id, email, amount_usd, currency, provider_url, status, provider
    FROM crypto_payment_intents
    WHERE order_id = $1
    LIMIT 1
  `,
    [orderId]
  )
  return result.rows[0] || null
}

async function saveIntent(input: {
  orderId: string
  email: string
  amountUsd: number
  currency: string
  checkoutUrl: string
  requestId: string | null
  webhookSecret: string | null
  fallbackSecret: string
  depositAddress: string | null
}) {
  const db = getDbPool()
  if (!db) throw new Error("database unavailable")

  const saved = await db.query(
    `
    INSERT INTO crypto_payment_intents (
      order_id,
      email,
      amount_usd,
      currency,
      provider_url,
      provider_payment_id,
      provider,
      status,
      webhook_secret,
      fallback_secret,
      deposit_address,
      request_id
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,'pending',$8,$9,$10,$11)
    ON CONFLICT (order_id) DO UPDATE SET
      email = EXCLUDED.email,
      amount_usd = EXCLUDED.amount_usd,
      currency = EXCLUDED.currency,
      provider_url = EXCLUDED.provider_url,
      provider_payment_id = EXCLUDED.provider_payment_id,
      provider = EXCLUDED.provider,
      status = 'pending',
      webhook_secret = EXCLUDED.webhook_secret,
      fallback_secret = EXCLUDED.fallback_secret,
      deposit_address = EXCLUDED.deposit_address,
      request_id = EXCLUDED.request_id,
      txid_out = NULL,
      coin = NULL,
      value_coin = NULL,
      paid_usd = NULL,
      hold_reason = NULL
    WHERE crypto_payment_intents.status <> 'completed'
  `,
    [
      input.orderId,
      input.email,
      input.amountUsd,
      input.currency,
      input.checkoutUrl,
      input.requestId,
      CARDTOUSDT_PROVIDER,
      input.webhookSecret,
      input.fallbackSecret,
      input.depositAddress,
      input.requestId
    ]
  )

  if (saved.rowCount) return

  const current = await loadIntent(input.orderId)
  if (current?.status === "completed") return
  throw new Error("Could not save CardToUSDT checkout")
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = typeof req.query?.order_id === "string" ? req.query.order_id : ""
  if (!orderId) {
    return res.status(400).json({ message: "order_id is required" })
  }

  try {
    const intent = await loadIntent(orderId)
    if (!intent || intent.provider !== CARDTOUSDT_PROVIDER) {
      return res.status(404).json({ message: "CardToUSDT checkout not found" })
    }

    return res.json({
      ok: true,
      order_id: intent.order_id,
      provider: intent.provider,
      provider_url: intent.provider_url,
      status: intent.status,
      amount_usd: Number(intent.amount_usd),
      currency: intent.currency
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load CardToUSDT checkout"
    return res.status(503).json({ message })
  }
}

export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id?.trim()
  const email = req.body?.email?.trim()
  const amountUsd = Number(req.body?.amount_usd || 0)
  const currency = (req.body?.currency || "USD").toUpperCase()

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, amount_usd are required" })
  }

  if (!isCardToUsdtConfigured()) {
    return res.status(503).json({
      ok: false,
      message:
        "Card checkout is not configured. Set CARDTOUSDT_PAYOUT_ADDRESS and a public HTTPS MEDUSA_PUBLIC_URL."
    })
  }

  try {
    const existing = await loadIntent(orderId)
    if (
      existing &&
      existing.provider === CARDTOUSDT_PROVIDER &&
      existing.provider_url &&
      existing.status !== "completed"
    ) {
      return res.json({
        ok: true,
        order_id: existing.order_id,
        provider: CARDTOUSDT_PROVIDER,
        provider_url: existing.provider_url,
        amount_usd: Number(existing.amount_usd),
        currency: existing.currency,
        reused: true,
        message: "Existing CardToUSDT checkout returned"
      })
    }

    if (existing?.provider === CARDTOUSDT_PROVIDER && existing.status === "completed") {
      return res.json({
        ok: true,
        order_id: existing.order_id,
        provider: CARDTOUSDT_PROVIDER,
        provider_url: existing.provider_url,
        amount_usd: Number(existing.amount_usd),
        currency: existing.currency,
        status: "completed",
        reused: true,
        message: "Payment already recorded"
      })
    }

    const created = await cardToUsdtCreateCheckout({
      orderId,
      email,
      amount: amountUsd,
      currency
    })

    if (!created.ok) {
      return res.status(502).json({
        ok: false,
        message: created.message,
        code: created.code,
        request_id: created.request_id
      })
    }

    await saveIntent({
      orderId,
      email,
      amountUsd: created.amount_usd,
      currency: created.currency,
      checkoutUrl: created.checkout_url,
      requestId: created.request_id,
      webhookSecret: created.webhook_secret,
      fallbackSecret: created.fallback_secret,
      depositAddress: created.deposit_address
    })

    const stored = await loadIntent(orderId)
    if (stored?.status === "completed") {
      return res.json({
        ok: true,
        order_id: stored.order_id,
        provider: CARDTOUSDT_PROVIDER,
        provider_url: stored.provider_url,
        amount_usd: Number(stored.amount_usd),
        currency: stored.currency,
        status: "completed",
        reused: true,
        message: "Payment already recorded"
      })
    }

    return res.json({
      ok: true,
      order_id: orderId,
      provider: CARDTOUSDT_PROVIDER,
      provider_url: stored?.provider_url || created.checkout_url,
      amount_usd: created.amount_usd,
      currency: created.currency,
      request_id: created.request_id,
      reused: false,
      message: "CardToUSDT checkout created"
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "CardToUSDT checkout failed"
    console.error("[cardtousdt-intent]", error)
    return res.status(502).json({ ok: false, message })
  }
}
