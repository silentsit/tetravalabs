import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

type Body = {
  disclaimer_version?: string
  acknowledged_at?: string
}

/**
 * POST /store/compliance/acknowledge
 * Persists acknowledgement to session/cart metadata in production wiring.
 */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const disclaimerVersion = req.body?.disclaimer_version || "v1"
  const acknowledgedAt = req.body?.acknowledged_at || new Date().toISOString()

  return res.status(200).json({
    acknowledged: true,
    disclaimer_version: disclaimerVersion,
    acknowledged_at: acknowledgedAt
  })
}
