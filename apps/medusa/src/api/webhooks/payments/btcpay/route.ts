import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import {
  fetchBtcpayInvoice,
  isBtcpayConfigured,
  mapBtcpayEventType,
  verifyBtcpayWebhookSignature
} from "../../../../lib/btcpay"
import { sendPaymentReceivedEmail } from "../../../../lib/resend"

type BtcpayWebhookPayload = {
  type?: string
  invoiceId?: string
  storeId?: string
  timestamp?: number
}

function getRawBody(req: MedusaRequest): string {
  const raw = (req as MedusaRequest & { rawBody?: Buffer | string }).rawBody
  if (Buffer.isBuffer(raw)) return raw.toString("utf8")
  if (typeof raw === "string" && raw.length) return raw
  if (typeof req.body === "string") return req.body
  return JSON.stringify(req.body ?? {})
}

export const POST = async (req: MedusaRequest<BtcpayWebhookPayload>, res: MedusaResponse) => {
  try {
    const rawBody = getRawBody(req)
    const signature = req.headers["btcpay-sig"] as string | undefined

    if (!verifyBtcpayWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ message: "Invalid BTCPay signature" })
    }

    let payload: BtcpayWebhookPayload
    try {
      payload = JSON.parse(rawBody) as BtcpayWebhookPayload
    } catch {
      return res.status(400).json({ message: "Invalid JSON" })
    }

    const eventType = payload.type || "unknown"
    const invoiceId = payload.invoiceId
  const mappedStatus = mapBtcpayEventType(eventType)
  let orderId: string | null = null
  let intentEmail: string | null = null
  let intentAmount: number | null = null
  let previousStatus: string | null = null

  if (invoiceId) {
    const existing = await withDb(
      async (db) => {
        const result = await db.query(
          `SELECT order_id, email, amount_usd, status FROM crypto_payment_intents WHERE provider_payment_id = $1 LIMIT 1`,
          [invoiceId]
        )
        return result.rows[0] || null
      },
      async () => null
    )
    orderId = (existing?.order_id as string | undefined) || null
    intentEmail = (existing?.email as string | undefined) || null
    intentAmount = existing?.amount_usd != null ? Number(existing.amount_usd) : null
    previousStatus = (existing?.status as string | undefined) || null

    if (!orderId && isBtcpayConfigured()) {
      const invoice = await fetchBtcpayInvoice(invoiceId)
      orderId = invoice?.metadata?.orderId || null
    }

    if (orderId && (!intentEmail || intentAmount == null)) {
      const byOrder = await withDb(
        async (db) => {
          const result = await db.query(
            `SELECT email, amount_usd, status FROM crypto_payment_intents WHERE order_id = $1 LIMIT 1`,
            [orderId]
          )
          return result.rows[0] || null
        },
        async () => null
      )
      if (byOrder) {
        intentEmail = intentEmail || ((byOrder.email as string | undefined) || null)
        intentAmount =
          intentAmount != null
            ? intentAmount
            : byOrder.amount_usd != null
              ? Number(byOrder.amount_usd)
              : null
        previousStatus = previousStatus || ((byOrder.status as string | undefined) || null)
      }
    }
  }

  await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [eventType, mappedStatus, orderId, invoiceId ?? null, payload]
      )

      if (orderId) {
        await db.query(
          `UPDATE crypto_payment_intents SET status = $1 WHERE order_id = $2`,
          [mappedStatus, orderId]
        )
      } else if (invoiceId) {
        await db.query(
          `UPDATE crypto_payment_intents SET status = $1 WHERE provider_payment_id = $2`,
          [mappedStatus, invoiceId]
        )
      }
    },
    async () => undefined
  )

  if (
    orderId &&
    intentEmail &&
    mappedStatus === "completed" &&
    previousStatus !== "completed" &&
    intentAmount != null
  ) {
    await sendPaymentReceivedEmail({
      email: intentEmail,
      orderId,
      amountUsd: intentAmount
    })
  }

  return res.status(202).json({
    accepted: true,
    provider: "btcpay",
    event: eventType,
    mapped_status: mappedStatus,
    order_id: orderId,
    invoice_id: invoiceId
  })
  } catch (error) {
    console.error("[btcpay] webhook handler failed:", error)
    return res.status(500).json({ message: "BTCPay webhook processing failed" })
  }
}
