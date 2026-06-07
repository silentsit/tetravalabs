import crypto from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type CryptoWebhookPayload = {
  event?: string
  order_id?: string
  payment_id?: string
}

const verifySignature = (rawBody: string, signature: string | undefined) => {
  const secret = process.env.CRYPTO_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
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

  /**
   * Production wiring:
   * 1) map event -> order/payment status
   * 2) update Medusa order via workflow/service
   * 3) append compliance-safe audit metadata
   */
  return res.status(202).json({
    accepted: true,
    event,
    order_id: orderId,
    payment_id: paymentId
  })
}
