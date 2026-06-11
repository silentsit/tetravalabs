import { createHash } from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import {
  getPaymentoIpnSignatureHeader,
  isPaymentoConfigured,
  mapPaymentoOrderStatus,
  paymentoVerifyToken,
  verifyPaymentoHmac,
  type PaymentoIpnPayload
} from "../../../../lib/paymento"
import { sendPaymentReceivedEmail } from "../../../../lib/resend"
import { getWebhookRawBody } from "../../../../lib/webhook-raw-body"

function parsePayload(rawBody: string): PaymentoIpnPayload | null {
  try {
    return JSON.parse(rawBody) as PaymentoIpnPayload
  } catch {
    return null
  }
}

/** Paymento dashboard "test link" often hits GET before POST IPNs are configured. */
export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  return res.status(200).json({
    ok: true,
    provider: "paymento",
    message: "Paymento IPN endpoint is reachable. POST signed callbacks here.",
    configured: isPaymentoConfigured()
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const rawBody = getWebhookRawBody(req)
    const secret = process.env.PAYMENTO_SECRET_KEY?.trim()

    if (!isPaymentoConfigured() || !secret) {
      return res.status(501).json({ message: "Paymento is not configured" })
    }

    const signature = getPaymentoIpnSignatureHeader(req.headers as Record<string, unknown>)
    if (!signature) {
      return res.status(401).json({ message: "Missing Paymento signature" })
    }
    if (!verifyPaymentoHmac(rawBody, signature, secret)) {
      return res.status(401).json({ message: "Invalid Paymento signature" })
    }

    const payload = parsePayload(rawBody)
    if (!payload) {
      return res.status(400).json({ message: "Invalid JSON" })
    }

    const token = payload.Token
    const paymentId = payload.PaymentId
    const orderId = payload.OrderId
    const ipnStatus = payload.OrderStatus

    if (token == null || paymentId == null || !orderId || ipnStatus == null) {
      return res.status(400).json({ message: "Invalid Paymento payload" })
    }

    const bodyHash = createHash("sha256").update(rawBody, "utf8").digest("hex")
    const mappedStatus = mapPaymentoOrderStatus(ipnStatus)

    const duplicate = await withDb(
      async (db) => {
        const result = await db.query(
          `SELECT id FROM payment_webhook_events WHERE payment_id = $1 AND event_name = $2 LIMIT 1`,
          [`paymento:${paymentId}:${ipnStatus}`, `paymento.status.${ipnStatus}`]
        )
        return Boolean(result.rows[0])
      },
      async () => false
    )

    if (duplicate) {
      return res.status(200).json({ ok: true, duplicate: true })
    }

    let intentEmail: string | null = null
    let intentAmount: number | null = null
    let previousStatus: string | null = null
    let finalStatus = mappedStatus

    if (ipnStatus === 7) {
      const verify = await paymentoVerifyToken(String(token))
      if (!verify.ok) {
        finalStatus = "requires_action"
      } else if (verify.orderId != null && String(verify.orderId) !== String(orderId)) {
        finalStatus = "requires_action"
      }
    }

    const intent = await withDb(
      async (db) => {
        const result = await db.query(
          `SELECT order_id, email, amount_usd, status FROM crypto_payment_intents WHERE order_id = $1 LIMIT 1`,
          [orderId]
        )
        return result.rows[0] || null
      },
      async () => null
    )

    if (intent) {
      intentEmail = (intent.email as string | undefined) || null
      intentAmount = intent.amount_usd != null ? Number(intent.amount_usd) : null
      previousStatus = (intent.status as string | undefined) || null
    }

    await withDb(
      async (db) => {
        await db.query(
          `
          INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
          VALUES ($1, $2, $3, $4, $5)
        `,
          [
            `paymento.status.${ipnStatus}`,
            finalStatus,
            orderId,
            `paymento:${paymentId}:${ipnStatus}`,
            { ...payload, bodyHash }
          ]
        )

        if (intent && finalStatus !== "requires_action") {
          await db.query(`UPDATE crypto_payment_intents SET status = $1 WHERE order_id = $2`, [
            finalStatus,
            orderId
          ])
          if (finalStatus === "completed") {
            await db.query(
              `UPDATE crypto_payment_intents SET provider_payment_id = $1 WHERE order_id = $2`,
              [token, orderId]
            )
          }
        }
      },
      async () => undefined
    )

    if (
      orderId &&
      intentEmail &&
      finalStatus === "completed" &&
      previousStatus !== "completed" &&
      intentAmount != null
    ) {
      await sendPaymentReceivedEmail({
        email: intentEmail,
        orderId,
        amountUsd: intentAmount
      })
    }

    return res.status(200).json({
      ok: true,
      provider: "paymento",
      order_id: orderId,
      mapped_status: finalStatus,
      ipn_status: ipnStatus,
      order_found: Boolean(intent)
    })
  } catch (error) {
    console.error("[paymento] IPN handler failed:", error)
    return res.status(500).json({ message: "Paymento IPN processing failed" })
  }
}
