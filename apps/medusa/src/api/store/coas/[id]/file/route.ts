import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../../lib/db"
import { getCoaObject, isR2Configured } from "../../../../../lib/r2-storage"

/**
 * GET /store/coas/:id/file
 * Streams the COA/HPLC file from R2 using server credentials (works even when the public r2.dev URL is private).
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
        SELECT id, document_url, storage_key, metadata
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

  const storageKey =
    (typeof row.storage_key === "string" && row.storage_key.trim()) ||
    (typeof row.document_url === "string" && row.document_url.startsWith("r2://")
      ? row.document_url.slice("r2://".length)
      : "")

  if (!storageKey) {
    return res.status(404).json({ message: "Document file is not available" })
  }

  if (!isR2Configured()) {
    return res.status(503).json({ message: "Document storage is not configured" })
  }

  try {
    const { body, contentType } = await getCoaObject(storageKey)
    res.setHeader("Content-Type", contentType)
    res.setHeader("Cache-Control", "public, max-age=3600")
    return res.status(200).send(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load COA file"
    console.error("[coa-file]", id, message)
    return res.status(404).json({ message: "Document file is not available" })
  }
}
