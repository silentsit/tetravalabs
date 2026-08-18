import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { bindCheckoutCustomer } from "../../../../lib/checkout-customer-link"

type Body = {
  email?: string
  cart_id?: string
  order_id?: string
}

/**
 * POST /store/checkout/bind-customer
 * Silently attach a guest cart/order to an existing registered customer when emails match.
 * Optional Bearer token links using the authenticated customer when emails align.
 */
export const POST = async (req: AuthenticatedMedusaRequest<Body>, res: MedusaResponse) => {
  const email = req.body?.email?.trim()
  if (!email) {
    return res.status(400).json({ ok: false, message: "email is required" })
  }

  const result = await bindCheckoutCustomer({
    email,
    cartId: req.body?.cart_id,
    orderId: req.body?.order_id,
    authenticatedCustomerId: req.auth_context?.actor_id || null
  })

  if (!result.ok) {
    return res.status(400).json(result)
  }

  return res.json(result)
}
