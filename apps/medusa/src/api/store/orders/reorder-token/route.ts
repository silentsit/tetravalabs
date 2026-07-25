import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { markReorderTokenUsed, resolveReorderToken } from "../../../../lib/order-reorder-token"

/**
 * GET /store/orders/reorder-token?token=
 * Resolve a signed R1–R3 reorder magic link into cart seed lines.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const token = String(req.query.token || "").trim()
  if (!token) {
    return res.status(400).json({ ok: false, message: "token is required" })
  }

  const resolved = await resolveReorderToken(token)
  if (!resolved.ok) {
    return res.status(404).json({ ok: false, message: resolved.reason })
  }

  return res.json({
    ok: true,
    order_id: resolved.orderId,
    email: resolved.email,
    items: resolved.items.map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      handle: item.handle,
      variantId: item.variantId,
      productId: item.productId
    }))
  })
}

type Body = {
  token?: string
  mark_used?: boolean
}

/** POST marks the token used after the storefront seeds the cart (optional single-use). */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const token = req.body?.token?.trim()
  if (!token) {
    return res.status(400).json({ ok: false, message: "token is required" })
  }

  const resolved = await resolveReorderToken(token)
  if (!resolved.ok) {
    // Already used is OK for idempotent mark_used calls
    if (req.body?.mark_used && resolved.reason.includes("already used")) {
      return res.json({ ok: true, already_used: true })
    }
    return res.status(404).json({ ok: false, message: resolved.reason })
  }

  if (req.body?.mark_used) {
    await markReorderTokenUsed(token)
  }

  return res.json({
    ok: true,
    order_id: resolved.orderId,
    items: resolved.items
  })
}
