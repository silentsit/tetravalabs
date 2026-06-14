import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  deleteTypesenseProduct,
  mapProductToTypesenseDoc,
  syncProductToTypesense,
  upsertTypesenseProduct
} from "../../../../lib/typesense-index"
import { isTypesenseConfigured } from "../../../../lib/typesense-search"

/**
 * POST /hooks/typesense/sync
 * Internal hook for catalog import or ops scripts. Requires x-typesense-sync-secret header.
 *
 * Body: { action: "upsert"|"delete"|"full", product_id?: string, handle?: string }
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const secret = req.headers["x-typesense-sync-secret"]
  const expected = process.env.TYPESENSE_SYNC_SECRET

  if (!expected || secret !== expected) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (!isTypesenseConfigured()) {
    return res.status(503).json({ message: "Typesense is not configured" })
  }

  const body = (req.body || {}) as {
    action?: string
    product_id?: string
    handle?: string
  }

  const action = body.action || "upsert"

  if (action === "delete") {
    const id = body.product_id?.trim()
    if (!id) {
      return res.status(400).json({ message: "product_id is required for delete" })
    }
    const result = await deleteTypesenseProduct(id)
    return res.status(result.ok ? 200 : 502).json(result)
  }

  if (action === "full") {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const limit = 100
    let offset = 0
    let indexed = 0
    let failed = 0

    while (true) {
      const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "metadata", "variants.*", "variants.prices.*"],
        pagination: { skip: offset, take: limit }
      })

      const batch = products || []
      if (batch.length === 0) break

      for (const product of batch) {
        const result = await upsertTypesenseProduct(mapProductToTypesenseDoc(product))
        if (result.ok) indexed += 1
        else failed += 1
      }

      if (batch.length < limit) break
      offset += limit
    }

    return res.json({ action: "full", indexed, failed })
  }

  if (body.product_id) {
    const result = await syncProductToTypesense(req.scope, body.product_id)
    return res.status(result.ok ? 200 : 502).json(result)
  }

  if (body.handle) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { handle: body.handle }
    })
    const productId = data?.[0]?.id as string | undefined
    if (!productId) {
      return res.status(404).json({ message: "Product not found" })
    }
    const result = await syncProductToTypesense(req.scope, productId)
    return res.status(result.ok ? 200 : 502).json(result)
  }

  return res.status(400).json({ message: "Provide action and product_id, handle, or action=full" })
}
