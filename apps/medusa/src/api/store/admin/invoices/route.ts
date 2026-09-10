import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { listManualCardInvoices, type InvoiceStatus } from "../../../../lib/manual-card-invoice"
import { getCustomerEmail } from "../../../../lib/reviews"
import { isStoreAdminEmail } from "../../../../lib/store-admin"

const STATUSES = new Set<InvoiceStatus | "all">(["on_hold", "processing", "completed", "cancelled", "all"])

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Sign in required" })
  }

  const email = await getCustomerEmail(req.scope, customerId)
  if (!isStoreAdminEmail(email)) {
    return res.status(403).json({ message: "Admin access required" })
  }

  const requested = String(req.query.status || "on_hold").trim()
  const status = STATUSES.has(requested as InvoiceStatus | "all")
    ? (requested as InvoiceStatus | "all")
    : "on_hold"

  const items = await listManualCardInvoices(status)
  return res.json({
    ok: true,
    status,
    count: items.length,
    items: items.map((row) => ({
      order_id: row.order_id,
      email: row.email,
      display_id: row.display_id,
      first_name: row.first_name,
      last_name: row.last_name,
      payment_method: row.payment_method,
      payment_method_title: row.payment_method_title,
      status: row.status,
      amount_usd: Number(row.amount_usd),
      currency: row.currency,
      items: row.items,
      shipping: row.shipping,
      internal_note: row.internal_note,
      paid_at: row.paid_at,
      created_at: row.created_at
    }))
  })
}
