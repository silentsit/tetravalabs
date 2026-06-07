import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

/**
 * GET /store/coas?variant_id=...
 * Returns batch-level COA/HPLC placeholders.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const variantId = String(req.query.variant_id || "")

  if (!variantId) {
    return res.status(400).json({
      message: "variant_id is required"
    })
  }

  return res.json({
    variant_id: variantId,
    items: [],
    note: "Wire this endpoint to lab_batch_documents table in production."
  })
}
