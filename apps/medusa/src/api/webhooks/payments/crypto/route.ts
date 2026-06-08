import crypto from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { mapCryptoEventToOrderStatus } from "../../../../lib/payments"

type CryptoWebhookPayload = {
  event?: string
  order_id?: string
  payment_id?: string
}

const verifySignature = (rawBody: string, signature: string | undefined) => {
  const secret = process.env.CRYPTO_WEBHOOK_SECRET
  if (!secret) {
    return process.env.NODE_ENV !== "production"
  }
  if (!signature) return false

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  if (digest.length !== signature.length) return false

  return crypto.timingSafeEqual(Buffer.from(digest, "utf8"), Buffer.from(signature, "utf8"))
}

/**
 * POST /webhooks/payments/crypto
 * Handles pending/confirmed/failed/expired statuses from the crypto provider.
 */
export const POST = async (
  req: MedusaRequest<CryptoWebhookPayload>,
  res: MedusaResponse
) => {
  const rawBody = JSON.stringify(req.body ?? {})
  const signature = req.headers["x-signature"] as string | undefined
  const valid = verifySignature(rawBody, signature)

  if (!valid) {
    return res.status(401).json({ message: "Invalid signature" })
  }

  const event = req.body?.event || "unknown"
  const orderId = req.body?.order_id
  const paymentId = req.body?.payment_id
  const mappedStatus = mapCryptoEventToOrderStatus(event)

  await withDb(
    async (db) => {
      await db.query(
        `
        CREATE TABLE IF NOT EXISTS payment_webhook_events (
          id BIGSERIAL PRIMARY KEY,
          event_name TEXT NOT NULL,
          mapped_status TEXT NOT NULL,
          order_id TEXT,
          payment_id TEXT,
          payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `
      )

      await db.query(
        `
        INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [event, mappedStatus, orderId ?? null, paymentId ?? null, req.body ?? {}]
      )
    },
    async () => undefined
  )

  return res.status(202).json({
    accepted: true,
    event,
    mapped_status: mappedStatus,
    order_id: orderId,
    payment_id: paymentId
  })
}
