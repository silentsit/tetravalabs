import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { scheduleOrderEmails } from "../../../../lib/order-email-schedule"
import type { OrderEmailItem, PaymentMethod } from "../../../../lib/order-email-templates"

type Body = {
  order_id?: string
  email?: string
  display_id?: number
  total_usd?: number
  payment_method?: PaymentMethod
  items?: OrderEmailItem[]
  defer_confirmation_until_paid?: boolean
}

function normalizeItems(items: Body["items"]) {
  return (items || [])
    .filter(
      (item): item is OrderEmailItem =>
        Boolean(item?.title) && typeof item.quantity === "number" && typeof item.unitPrice === "number"
    )
    .map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      handle: item.handle,
      variantId: item.variantId,
      productId: item.productId
    }))
}

/**
 * POST /store/orders/email-schedule
 * Queues unpaid payment reminders, or stores checkout context when confirmation is deferred.
 */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id?.trim()
  const email = req.body?.email?.trim()
  const displayId = req.body?.display_id
  const totalUsd = Number(req.body?.total_usd || 0)
  const paymentMethod =
    req.body?.payment_method === "manual_card_invoice"
      ? "manual_card_invoice"
      : req.body?.payment_method === "cardtousdt"
        ? "cardtousdt"
        : req.body?.payment_method === "card"
          ? "cardtousdt"
          : req.body?.payment_method === "wise"
            ? "wise"
            : "crypto"
  const items = normalizeItems(req.body?.items)

  if (!orderId || !email || totalUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, and total_usd are required" })
  }

  const result = await scheduleOrderEmails({
    orderId,
    email,
    displayId,
    totalUsd,
    paymentMethod,
    items,
    deferConfirmationUntilPaid: Boolean(req.body?.defer_confirmation_until_paid)
  })

  if (!result.ok) {
    return res.status(503).json({ message: result.reason || "Unable to schedule order emails" })
  }

  return res.status(202).json({ ok: true, order_id: orderId, scheduled: true })
}
