import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  cancelCheckoutAbandon,
  scheduleCheckoutAbandon
} from "../../../../lib/checkout-abandon"
import type { OrderEmailItem } from "../../../../lib/order-email-templates"

type Body = {
  session_id?: string
  email?: string
  subtotal_usd?: number
  items?: OrderEmailItem[]
  action?: "schedule" | "cancel"
}

function normalizeItems(items: Body["items"]) {
  return (items || [])
    .filter(
      (item): item is OrderEmailItem =>
        Boolean(item?.title) &&
        typeof item.quantity === "number" &&
        typeof item.unitPrice === "number"
    )
    .map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
}

/**
 * POST /store/checkout/abandon-schedule
 * Capture checkout email for abandon recovery, or cancel after order placed.
 */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const action = req.body?.action === "cancel" ? "cancel" : "schedule"
  const sessionId = req.body?.session_id?.trim()

  if (!sessionId) {
    return res.status(400).json({ message: "session_id is required" })
  }

  if (action === "cancel") {
    const result = await cancelCheckoutAbandon(sessionId)
    if (!result.ok) {
      return res.status(503).json({ message: "Unable to cancel checkout abandon schedule" })
    }
    return res.status(202).json({ ok: true, cancelled: true })
  }

  const email = req.body?.email?.trim()
  const subtotalUsd = Number(req.body?.subtotal_usd || 0)
  const items = normalizeItems(req.body?.items)

  if (!email || !items.length) {
    return res.status(400).json({ message: "email and items are required" })
  }

  const result = await scheduleCheckoutAbandon({
    sessionId,
    email,
    items,
    subtotalUsd
  })

  if (!result.ok) {
    return res.status(503).json({ message: result.reason || "Unable to schedule checkout abandon" })
  }

  return res.status(202).json({ ok: true, scheduled: true })
}
