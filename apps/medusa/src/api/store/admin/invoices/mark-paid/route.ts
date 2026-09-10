import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { markInvoicePaid } from "../../../../../lib/manual-card-invoice"
import { getCustomerEmail } from "../../../../../lib/reviews"
import { isStoreAdminEmail } from "../../../../../lib/store-admin"

type Body = {
  order_id?: string
}

export const POST = async (req: AuthenticatedMedusaRequest<Body>, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Sign in required" })
  }

  const email = await getCustomerEmail(req.scope, customerId)
  if (!isStoreAdminEmail(email)) {
    return res.status(403).json({ message: "Admin access required" })
  }

  const orderId = req.body?.order_id?.trim()
  if (!orderId) {
    return res.status(400).json({ message: "order_id is required" })
  }

  const result = await markInvoicePaid(orderId, req.scope)
  if (!result.ok) {
    return res.status(result.status).json({ message: result.message })
  }

  return res.json({
    ok: true,
    order_id: result.order_id,
    status: result.status,
    paid_at: result.paid_at
  })
}
