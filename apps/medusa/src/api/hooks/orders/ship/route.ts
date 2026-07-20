import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { recordOrderShipmentAndNotify } from "../../../../lib/order-fulfillment-emails"
import type { OrderEmailItem } from "../../../../lib/order-email-templates"

type Body = {
  order_id?: string
  tracking_number?: string
  tracking_url?: string
  carrier?: string
  email?: string
  display_id?: number
  items?: OrderEmailItem[]
}

/**
 * POST /hooks/orders/ship
 * Ops endpoint: record tracking + send shipped email (F1).
 * Requires x-order-email-cron-secret (same secret as email cron).
 *
 * Body: { order_id, tracking_number, tracking_url?, carrier?, email?, display_id? }
 */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const secret = req.headers["x-order-email-cron-secret"]
  const expected = process.env.ORDER_EMAIL_CRON_SECRET

  if (!expected || secret !== expected) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const orderId = req.body?.order_id?.trim()
  const trackingNumber = req.body?.tracking_number?.trim()

  if (!orderId || !trackingNumber) {
    return res.status(400).json({ message: "order_id and tracking_number are required" })
  }

  const result = await recordOrderShipmentAndNotify({
    orderId,
    trackingNumber,
    trackingUrl: req.body?.tracking_url,
    carrier: req.body?.carrier,
    email: req.body?.email,
    displayId: req.body?.display_id,
    items: req.body?.items
  })

  if (!result.ok) {
    return res.status(502).json({ ok: false, message: result.reason })
  }

  return res.json({
    ok: true,
    order_id: orderId,
    emailed: result.emailed,
    reason: "reason" in result ? result.reason : undefined
  })
}
