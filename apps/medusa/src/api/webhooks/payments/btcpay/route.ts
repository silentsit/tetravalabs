import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import {
  fetchBtcpayInvoice,
  isBtcpayConfigured,
  mapBtcpayEventType,
  verifyBtcpayWebhookSignature
} from "../../../../lib/btcpay"

type BtcpayWebhookPayload = {
  type?: string
  invoiceId?: string
  storeId?: string
  timestamp?: number
}

export const POST = async (req: MedusaRequest<BtcpayWebhookPayload>, res: MedusaResponse) => {
  const rawBody = JSON.stringify(req.body ?? {})
  const signature = req.headers["btcpay-sig"] as string | undefined

  if (!verifyBtcpayWebhookSignature(rawBody, signature)) {
    return res.status(401).json({ message: "Invalid BTCPay signature" })
  }

  const eventType = req.body?.type || "unknown"
  const invoiceId = req.body?.invoiceId
  const mappedStatus = mapBtcpayEventType(eventType)
  let orderId: string | null = null

  if (invoiceId) {
    const existing = await withDb(
      async (db) => {
        const result = await db.query(
          `SELECT order_id FROM crypto_payment_intents WHERE provider_payment_id = $1 LIMIT 1`,
          [invoiceId]
        )
        return (result.rows[0]?.order_id as string | undefined) || null
      },
      async () => null
    )
    orderId = existing

    if (!orderId && isBtcpayConfigured()) {
      const invoice = await fetchBtcpayInvoice(invoiceId)
      orderId = invoice?.metadata?.orderId || null
    }
  }

  await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO payment_webhook_events (event_name, mapped_status, order_id, payment_id, payload)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [eventType, mappedStatus, orderId, invoiceId ?? null, req.body ?? {}]
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

  return res.status(202).json({
    accepted: true,
    provider: "btcpay",
    event: eventType,
    mapped_status: mappedStatus,
    order_id: orderId,
    invoice_id: invoiceId
  })
}
