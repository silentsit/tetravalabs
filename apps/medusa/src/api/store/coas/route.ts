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
  const metadata = row.metadata || {}
  const previewStorageKey =
    typeof metadata.preview_storage_key === "string" ? metadata.preview_storage_key.trim() : ""
  const previewUrl = previewStorageKey ? resolveCoaDocumentUrl("", previewStorageKey) : null

  return {
    id: row.id,
    variant_id: row.variant_id,
    batch_number: row.batch_number,
    purity_percent: row.purity_percent,
    tested_at: row.tested_at,
    document_type: row.document_type,
    document_url: resolveCoaDocumentUrl(row.document_url, row.storage_key),
    preview_url: previewUrl,
    storage_key: row.storage_key || null,
    metadata
  }
}

/**
 * GET /store/coas?variant_id=...
 * Returns batch-level COA/HPLC documents with R2-backed public URLs when configured.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const variantId = String(req.query.variant_id || "")
  const limit = Math.min(Math.max(Number(req.query.limit) || 25, 1), 250)
  const items = await withDb(
    async (db) => {
      const totalResult = variantId
        ? await db.query(
            `SELECT COUNT(*)::int AS count FROM lab_batch_documents WHERE variant_id = $1`,
            [variantId]
          )
        : await db.query(`SELECT COUNT(*)::int AS count FROM lab_batch_documents`)
      const total = totalResult.rows[0]?.count ?? 0

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
      return { rows: result.rows as LabDocumentRow[], total }
    },
    async () => ({ rows: [] as LabDocumentRow[], total: 0 })
  )

  return res.json({
    variant_id: variantId || null,
    count: items.total,
    limit,
    returned: items.rows.length,
    r2_configured: isR2Configured(),
    items: items.rows.map(mapDocument)
  })
}
