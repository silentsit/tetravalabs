import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../../lib/db"
import { getCoaSignedUrl, isR2Configured, resolveCoaDocumentUrl } from "../../../../../lib/r2-storage"

/**
 * GET /store/coas/:id/file
 * Redirects to a signed R2 URL when the bucket is private (no R2_PUBLIC_BASE_URL).
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = String(req.params?.id || "").trim()
  if (!id) {
    return res.status(400).json({ message: "Document id is required" })
  }

  const row = await withDb(
    async (db) => {
      const result = await db.query(
        `
        SELECT id, document_url, storage_key
        FROM lab_batch_documents
        WHERE id = $1
        LIMIT 1
      `,
        [id]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  if (!row) {
    return res.status(404).json({ message: "Document not found" })
  }

  const publicUrl = resolveCoaDocumentUrl(row.document_url, row.storage_key)
  if (publicUrl && !publicUrl.includes("example.com") && !publicUrl.startsWith("r2://")) {
    return res.redirect(publicUrl, 302)
  }

  if (!isR2Configured() || !row.storage_key) {
    return res.status(404).json({ message: "Document file is not available" })
  }

  try {
    const signedUrl = await getCoaSignedUrl(row.storage_key)
    return res.redirect(signedUrl, 302)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign COA URL"
    return res.status(502).json({ message })
  }
}
