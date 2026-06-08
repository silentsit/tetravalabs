import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../lib/db"

/**
 * GET /store/coas?variant_id=...
 * Returns batch-level COA/HPLC placeholders.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const variantId = String(req.query.variant_id || "")
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)

  if (!variantId) {
    return res.status(400).json({
      message: "variant_id is required"
    })
  }

  const items = await withDb(
    async (db) => {
      const result = await db.query(
        `
        SELECT id, variant_id, batch_number, purity_percent, tested_at, document_type, document_url, metadata
        FROM lab_batch_documents
        WHERE variant_id = $1
        ORDER BY tested_at DESC NULLS LAST, created_at DESC
        LIMIT $2
      `,
        [variantId, limit]
      )
      return result.rows
    },
    async () => []
  )

  return res.json({
    variant_id: variantId,
    count: items.length,
    items
  })
}
