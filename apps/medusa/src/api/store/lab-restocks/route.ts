import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../lib/db"
import { listRestocksForEmail } from "../../../lib/lab-restock-db"
import { getCustomerEmail } from "../../../lib/reviews"

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ ok: false, message: "Authentication required" })
  }

  const email = await getCustomerEmail(req.scope, customerId)
  if (!email) {
    return res.status(400).json({ ok: false, message: "Customer email not found" })
  }

  const restocks = await withDb(
    async (db) => listRestocksForEmail(db, email, customerId),
    async () => []
  )

  return res.json({
    ok: true,
    restocks: restocks.map((row) => ({
      id: row.id,
      status: row.status,
      handle: row.handle,
      title: row.title,
      variantTitle: row.variant_title,
      quantity: row.quantity,
      unitPriceUsd: row.unit_price_usd,
      oneTimeUnitPriceUsd: row.one_time_unit_price_usd,
      cadenceDays: row.cadence_days,
      discountPct: row.discount_pct,
      nextBillingAt: row.next_billing_at,
      pausedAt: row.paused_at,
      cancelledAt: row.cancelled_at,
      latestOrderId: row.latest_order_id,
      createdAt: row.created_at
    }))
  })
}
