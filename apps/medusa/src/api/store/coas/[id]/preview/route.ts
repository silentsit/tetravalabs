import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../../lib/db"
import { getCoaObject, isR2Configured } from "../../../../../lib/r2-storage"

function previewStorageKey(metadata: unknown, storageKey: string) {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const key = (metadata as Record<string, unknown>).preview_storage_key
    if (typeof key === "string" && key.trim()) return key.trim()
  }

  if (/\.(jpe?g|png|webp|gif)$/i.test(storageKey)) return storageKey
  return storageKey.replace(/\.pdf$/i, ".preview.jpg")
}

/**
 * GET /store/coas/:id/preview
 * Streams a JPEG/PNG card thumbnail generated at COA sync time.
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
        SELECT id, storage_key, metadata
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

  const documentStorageKey =
    (typeof row.storage_key === "string" && row.storage_key.trim()) || ""

  if (!documentStorageKey) {
    return res.status(404).json({ message: "Preview is not available" })
  }

  if (!isR2Configured()) {
    return res.status(503).json({ message: "Document storage is not configured" })
  }

  const key = previewStorageKey(row.metadata, documentStorageKey)

  try {
    const { body, contentType } = await getCoaObject(key)
    res.setHeader("Content-Type", contentType.startsWith("image/") ? contentType : "image/jpeg")
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
    return res.status(200).send(body)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load COA preview"
    console.error("[coa-preview]", id, message)
    return res.status(404).json({ message: "Preview is not available" })
  }
}
