import { createHash } from "node:crypto"
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { captureOrderPayment } from "../../../../lib/capture-order-payment"
import {
  getPeptidepaySignatureHeader,
  isPeptidepayConfigured,
  parsePeptidepayWebhookEvent,
  verifyPeptidepayWebhookSignature
} from "../../../../lib/peptidepay"
import { sendPaymentReceivedEmail } from "../../../../lib/resend"
import { cancelOrderEmailSchedule } from "../../../../lib/order-email-schedule"
import { getWebhookRawBody } from "../../../../lib/webhook-raw-body"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  return res.status(200).json({
    ok: true,
    provider: "peptidepay",
    message: "Peptide Pay webhook endpoint is reachable. POST signed order.paid events here.",
    configured: isPeptidepayConfigured()
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const rawBody = getWebhookRawBody(req)
    const secret = process.env.PEPTIDEPAY_WEBHOOK_SECRET?.trim()

    if (!isPeptidepayConfigured() || !secret) {
      return res.status(501).json({ message: "Peptide Pay is not configured" })
    }

    const signature = getPeptidepaySignatureHeader(req.headers as Record<string, unknown>)
    if (!verifyPeptidepayWebhookSignature(rawBody, signature, secret)) {
      return res.status(401).json({ message: "Invalid Peptide Pay signature" })
    }

    const payload = parsePeptidepayWebhookEvent(rawBody)
    if (!payload || payload.event !== "order.paid") {
      return res.status(200).json({ ok: true, ignored: true })
    }

    const sessionId = payload.session_id?.trim()
    const orderId = payload.order_id?.trim()

    if (!sessionId || !orderId) {
      return res.status(400).json({ message: "Invalid Peptide Pay payload" })
    }

    const bodyHash = createHash("sha256").update(rawBody, "utf8").digest("hex")
    const eventKey = `peptidepay:${sessionId}:order.paid`

    const duplicate = await withDb(
      async (db) => {
        const result = await db.query(
          `SELECT id FROM payment_webhook_events WHERE payment_id = $1 AND event_name = $2 LIMIT 1`,
          [eventKey, "peptidepay.order.paid"]
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
          ["peptidepay.order.paid", "completed", orderId, eventKey, { ...payload, bodyHash }]
        )

        if (intent) {
          await db.query(`UPDATE crypto_payment_intents SET status = $1 WHERE order_id = $2`, [
            "completed",
            orderId
          ])
          await db.query(
            `UPDATE crypto_payment_intents SET provider_payment_id = $1 WHERE order_id = $2`,
            [sessionId, orderId]
          )
        }
      },
      async () => undefined
    )

    if (
      orderId &&
      intentEmail &&
      previousStatus !== "completed" &&
      intentAmount != null
    ) {
      const capture = await captureOrderPayment(orderId, req.scope)
      if (!capture.ok && !capture.alreadyPaid) {
        console.warn("[peptidepay] Medusa capture failed:", capture.reason)
      }

      await sendPaymentReceivedEmail({
        email: intentEmail,
        orderId,
        amountUsd: intentAmount
      })
      await cancelOrderEmailSchedule(orderId)
    }

    return res.status(200).json({
      ok: true,
      provider: "peptidepay",
      order_id: orderId,
      mapped_status: "completed",
      order_found: Boolean(intent)
    })
  } catch (error) {
    console.error("[peptidepay] Webhook handler failed:", error)
    return res.status(500).json({ message: "Peptide Pay webhook processing failed" })
  }
}
