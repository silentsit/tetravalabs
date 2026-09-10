import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { recordManualCardInvoice, type InvoiceShipping } from "../../../../lib/manual-card-invoice"
import { MANUAL_CARD_INVOICE_TITLE } from "../../../../lib/manual-card-invoice-config"
import { normalizeOrderEmailItems, type OrderEmailItem } from "../../../../lib/order-email-templates"

type Body = {
  order_id?: string
  email?: string
  display_id?: number
  first_name?: string
  last_name?: string
  amount_usd?: number
  currency?: string
  payment_method_title?: string
  items?: OrderEmailItem[]
  shipping?: InvoiceShipping
}

export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id?.trim()
  const email = req.body?.email?.trim()
  const amountUsd = Number(req.body?.amount_usd || 0)

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, and amount_usd are required" })
  }

  const result = await recordManualCardInvoice({
    orderId,
    email,
    displayId: req.body?.display_id,
    firstName: req.body?.first_name,
    lastName: req.body?.last_name,
    amountUsd,
    currency: req.body?.currency,
    items: normalizeOrderEmailItems(req.body?.items),
    shipping: req.body?.shipping || null,
    paymentMethodTitle: req.body?.payment_method_title || MANUAL_CARD_INVOICE_TITLE
  })

  if (!result.ok) {
    return res.status(503).json({ message: "Unable to record invoice order" })
  }

  return res.status(201).json({
    ok: true,
    order_id: result.order_id,
    payment_method: "manual_card_invoice",
    payment_method_title: req.body?.payment_method_title || MANUAL_CARD_INVOICE_TITLE,
    status: result.status,
    paid_at: result.paid_at
  })
}
