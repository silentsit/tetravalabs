import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { isValidRestockCadence } from "../../../../lib/lab-restock"
import { createManualRenewalCheckout } from "../../../../lib/lab-restock-processor"
import {
  getRestockById,
  resumeRestockForInvoice,
  updateRestockStatus
} from "../../../../lib/lab-restock-db"
import { getCustomerEmail } from "../../../../lib/reviews"

type Body = {
  action?: "pause" | "resume" | "cancel" | "skip" | "set_cadence" | "pay_now"
  cadenceDays?: number
}

export const POST = async (req: AuthenticatedMedusaRequest<Body>, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ ok: false, message: "Authentication required" })
  }

  const email = await getCustomerEmail(req.scope, customerId)
  if (!email) {
    return res.status(400).json({ ok: false, message: "Customer email not found" })
  }

  const id = req.params.id
  const action = req.body?.action
  if (!id || !action) {
    return res.status(400).json({ ok: false, message: "id and action are required" })
  }

  const restock = await withDb(async (db) => getRestockById(db, id), async () => null)
  if (!restock) {
    return res.status(404).json({ ok: false, message: "Restock not found" })
  }

  const owns =
    restock.customer_id === customerId ||
    restock.email.toLowerCase() === email.toLowerCase()
  if (!owns) {
    return res.status(403).json({ ok: false, message: "Not allowed" })
  }

  if (action === "pay_now") {
    const checkout = await createManualRenewalCheckout(id)
    if (!checkout.ok) {
      return res.status(502).json({ ok: false, message: checkout.message })
    }
    return res.json({
      ok: true,
      payment_url: checkout.payment_url,
      order_id: checkout.order_id
    })
  }

  if (action === "cancel") {
    await withDb(
      async (db) => updateRestockStatus(db, id, "cancelled"),
      async () => undefined
    )
    return res.json({ ok: true, status: "cancelled" })
  }

  if (action === "pause") {
    await withDb(
      async (db) => updateRestockStatus(db, id, "paused"),
      async () => undefined
    )
    return res.json({ ok: true, status: "paused" })
  }

  if (action === "resume") {
    await withDb(async (db) => resumeRestockForInvoice(db, id), async () => undefined)
    return res.json({ ok: true, status: "active", next_billing_at: "now" })
  }

  if (action === "skip") {
    const next = new Date()
    next.setDate(next.getDate() + restock.cadence_days)
    await withDb(
      async (db) =>
        updateRestockStatus(db, id, "active", {
          nextBillingAt: next
        }),
      async () => undefined
    )
    return res.json({ ok: true, status: "active", skipped: true })
  }

  if (action === "set_cadence") {
    const cadenceDays = req.body?.cadenceDays
    if (!isValidRestockCadence(cadenceDays)) {
      return res.status(400).json({ ok: false, message: "Invalid cadenceDays" })
    }
    await withDb(
      async (db) => updateRestockStatus(db, id, "active", { cadenceDays }),
      async () => undefined
    )
    return res.json({ ok: true, status: "active", cadenceDays })
  }

  return res.status(400).json({ ok: false, message: "Unknown action" })
}
