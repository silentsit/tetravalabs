import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../lib/db"
import { isR2Configured, resolveCoaDocumentUrl } from "../../../lib/r2-storage"

type LabDocumentRow = {
  id: string
  variant_id: string
  batch_number: string
  purity_percent: number | null
  tested_at: string | null
  document_type: "coa" | "hplc"
  document_url: string
  storage_key?: string | null
  metadata?: Record<string, unknown>
}

function mapDocument(row: LabDocumentRow) {
  return {
    id: row.id,
    variant_id: row.variant_id,
    batch_number: row.batch_number,
    purity_percent: row.purity_percent,
    tested_at: row.tested_at,
    document_type: row.document_type,
    document_url: resolveCoaDocumentUrl(row.document_url, row.storage_key),
    storage_key: row.storage_key || null,
    metadata: row.metadata || {}
  }
}

/**
 * GET /store/coas?variant_id=...
 * Returns batch-level COA/HPLC documents with R2-backed public URLs when configured.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const variantId = String(req.query.variant_id || "")
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 100)
  const items = await withDb(
    async (db) => {
      const result = variantId
        ? await db.query(
            `
          SELECT id, variant_id, batch_number, purity_percent, tested_at, document_type, document_url, storage_key, metadata
          FROM lab_batch_documents
          WHERE variant_id = $1
          ORDER BY tested_at DESC NULLS LAST, created_at DESC
          LIMIT $2
        `,
            [variantId, limit]
          )
        : await db.query(
            `
          SELECT id, variant_id, batch_number, purity_percent, tested_at, document_type, document_url, storage_key, metadata
          FROM lab_batch_documents
          ORDER BY tested_at DESC NULLS LAST, created_at DESC
          LIMIT $1
        `,
            [limit]
          )
      return result.rows as LabDocumentRow[]
    },
    async () => []
  )

  return res.json({
    variant_id: variantId || null,
    count: items.length,
    r2_configured: isR2Configured(),
    items: items.map(mapDocument)
  })
}
