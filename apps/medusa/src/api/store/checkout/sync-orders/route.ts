import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  findRegisteredCustomerById,
  linkGuestOrdersToRegisteredCustomer
} from "../../../../lib/checkout-customer-link"

/**
 * POST /store/checkout/sync-orders
 * After login/register, attach past guest orders with the same email to this account.
 */
export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ ok: false, message: "Authentication required" })
  }

  const customer = await findRegisteredCustomerById(customerId)
  if (!customer?.email) {
    return res.status(404).json({ ok: false, message: "Registered customer not found" })
  }

  const result = await linkGuestOrdersToRegisteredCustomer({
    customerId,
    email: customer.email
  })

  if (!result.ok) {
    return res.status(400).json(result)
  }

  return res.json(result)
}
