import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { captureOrderPayment } from "../../../../lib/capture-order-payment"
import {
  CARDTOUSDT_PROVIDER,
  cardToUsdtPaidUsd,
  getCardToUsdtFulfillBand,
  isCardToUsdtTimestampFresh,
  readCardToUsdtWebhookFields,
  secretsMatch,
  verifyCardToUsdtSignature
} from "../../../../lib/cardtousdt"
import { getDbPool } from "../../../../lib/db"
import { sendPaymentReceivedEmail } from "../../../../lib/resend"

type CheckoutRow = {
  order_id: string
  email: string
  amount_usd: string | number
  status: string
  webhook_secret: string | null
  fallback_secret: string | null
  txid_out: string | null
}

function queryRecord(req: MedusaRequest): Record<string, unknown> {
  const query = (req.query || {}) as Record<string, unknown>
  const reqUrl = typeof req.url === "string" ? req.url : ""
  if (reqUrl) {
    try {
      const url = reqUrl.startsWith("http") ? new URL(reqUrl) : new URL(reqUrl, "https://webhook.invalid")
      for (const [key, value] of url.searchParams.entries()) {
        if (query[key] == null) query[key] = value
      }
    } catch {
      // Use req.query only.
    }
  }
  return query
}

async function handleWebhook(req: MedusaRequest, res: MedusaResponse) {
  const fields = readCardToUsdtWebhookFields(
    queryRecord(req),
    (req.headers || {}) as Record<string, unknown>
  )

  // Their first call is GET to webhook_url (already has order_id/secret, no txid). 4xx here
  // looks dead. Only signature failures should be 4xx after settlement fields arrive.
  if (!fields.txid_out || !fields.value_coin || !fields.coin) {
    return res.status(200).json({
      ok: true,
      provider: CARDTOUSDT_PROVIDER,
      message: "CardToUSDT webhook is reachable. Settlement fields arrive on the query string."
    })
  }

  if (!fields.order_id) {
    return res.status(200).json({ ok: true, ignored: true, reason: "missing_order_id" })
  }

  const db = getDbPool()
  if (!db) {
    return res.status(503).json({ message: "Database unavailable" })
  }

  try {
    const loaded = await db.query<CheckoutRow>(
      `
      SELECT order_id, email, amount_usd, status, webhook_secret, fallback_secret, txid_out
      FROM crypto_payment_intents
      WHERE order_id = $1 AND provider = $2
      LIMIT 1
    `,
      [fields.order_id, CARDTOUSDT_PROVIDER]
    )
    const checkout = loaded.rows[0]
    if (!checkout) {
      return res.status(200).json({ ok: true, ignored: true, reason: "unknown_order" })
    }

    if (checkout.webhook_secret) {
      if (!fields.c2t_ts || !fields.c2t_sig) {
        return res.status(400).json({ message: "Missing signature" })
      }
      const ok = verifyCardToUsdtSignature({
        webhookSecret: checkout.webhook_secret,
        ts: fields.c2t_ts,
        txidOut: fields.txid_out,
        valueCoin: fields.value_coin,
        coin: fields.coin,
        signatureHeader: fields.c2t_sig
      })
      if (!ok) {
        return res.status(403).json({ message: "Invalid signature" })
      }
    } else if (!checkout.fallback_secret || !secretsMatch(checkout.fallback_secret, fields.secret)) {
      return res.status(403).json({ message: "Invalid webhook secret" })
    }

    const duplicateTx = await db.query(
      `SELECT order_id FROM crypto_payment_intents WHERE txid_out = $1 AND status = 'completed' LIMIT 1`,
      [fields.txid_out]
    )
    if (duplicateTx.rows[0] || checkout.status === "completed") {
      return res.status(200).json({ ok: true, duplicate: true, order_id: checkout.order_id })
    }

    if (checkout.webhook_secret && !isCardToUsdtTimestampFresh(fields.c2t_ts)) {
      await holdCheckout(db, checkout.order_id, fields, "stale_timestamp", null)
      return res.status(200).json({
        ok: true,
        held: true,
        reason: "stale_timestamp",
        order_id: checkout.order_id
      })
    }

    const expectedUsd = Number(checkout.amount_usd)
    const paidUsd = await cardToUsdtPaidUsd(fields.value_coin, fields.coin)
    const band = getCardToUsdtFulfillBand()

    if (paidUsd == null || !Number.isFinite(expectedUsd) || paidUsd < expectedUsd * band) {
      const reason = "below_band_or_unpriced"
      await holdCheckout(db, checkout.order_id, fields, reason, paidUsd)
      return res.status(200).json({
        ok: true,
        held: true,
        reason,
        order_id: checkout.order_id,
        paid_usd: paidUsd,
        expected_usd: expectedUsd,
        band
      })
    }

    let claimed
    try {
      claimed = await db.query(
        `
        UPDATE crypto_payment_intents
        SET
          status = 'completed',
          txid_out = $1,
          coin = $2,
          value_coin = $3,
          paid_usd = $4,
          hold_reason = NULL,
          provider_payment_id = COALESCE(provider_payment_id, $1)
        WHERE order_id = $5 AND status <> 'completed'
        RETURNING order_id
      `,
        [fields.txid_out, fields.coin, fields.value_coin, paidUsd, checkout.order_id]
      )
    } catch (error) {
      if (isPgUniqueViolation(error)) {
        return res.status(200).json({ ok: true, duplicate: true, order_id: checkout.order_id })
      }
      throw error
    }

    if (!claimed.rows[0]) {
      return res.status(200).json({ ok: true, duplicate: true, order_id: checkout.order_id })
    }

    try {
      await db.query(
        `
        INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          "cardtousdt.settled",
          "completed",
          checkout.order_id,
          `cardtousdt:${fields.txid_out}`,
          {
            txid_out: fields.txid_out,
            value_coin: fields.value_coin,
            coin: fields.coin,
            paid_usd: paidUsd,
            amount_usd: expectedUsd
          }
        ]
      )
    } catch (error) {
      console.error("[cardtousdt] webhook event insert failed:", error)
    }

    const capture = await captureOrderPayment(checkout.order_id, req.scope)
    if (!capture.ok && !capture.alreadyPaid) {
      console.warn("[cardtousdt] Medusa capture failed:", capture.reason)
    }

    try {
      await sendPaymentReceivedEmail({
        email: checkout.email,
        orderId: checkout.order_id,
        amountUsd: expectedUsd
      })
    } catch (error) {
      console.error("[cardtousdt] payment email failed:", error)
    }

    return res.status(200).json({
      ok: true,
      fulfilled: true,
      order_id: checkout.order_id,
      txid_out: fields.txid_out,
      paid_usd: paidUsd
    })
  } catch (error) {
    console.error("[cardtousdt] webhook failed:", error)
    return res.status(500).json({ message: "CardToUSDT webhook processing failed" })
  }
}

async function holdCheckout(
  db: NonNullable<ReturnType<typeof getDbPool>>,
  orderId: string,
  fields: ReturnType<typeof readCardToUsdtWebhookFields>,
  reason: string,
  paidUsd: number | null
) {
  await db.query(
    `
    INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
    VALUES ($1, $2, $3, $4, $5)
  `,
    [
      `cardtousdt.${reason}`,
      "held",
      orderId,
      `cardtousdt:${fields.txid_out}:${reason}`,
      {
        txid_out: fields.txid_out,
        value_coin: fields.value_coin,
        coin: fields.coin,
        paid_usd: paidUsd,
        reason
      }
    ]
  )

  await db.query(
    `
    UPDATE crypto_payment_intents
    SET
      status = 'held',
      coin = $1,
      value_coin = $2,
      paid_usd = $3,
      hold_reason = $4
    WHERE order_id = $5 AND status <> 'completed'
  `,
    [fields.coin, fields.value_coin, paidUsd, reason, orderId]
  )
}

function isPgUniqueViolation(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "23505")
}

export const GET = handleWebhook
export const POST = handleWebhook
