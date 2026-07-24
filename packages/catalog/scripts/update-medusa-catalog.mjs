/**
 * Update existing Medusa products with normalized catalog pack tiers (5/10/20 vials).
 * Supports compound-merged products (Strength + Pack Size options).
 *
 * Usage:
 *   npm run catalog:update
 *   npm run catalog:update -- --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  buildProductOptions,
  buildVariantBatch,
  isMergedCatalogProduct
} from "../lib/catalog-medusa-options.mjs"
import {
  ensureCategory,
  fetchCatalogProduct,
  formatAxiosError,
  getMedusaClient,
  loadMedusaEnv,
  requireMedusaCredentials,
  resolveAdminToken,
  syncTypesenseAfterChanges,
  verifyMedusaReachable
} from "../lib/medusa-admin.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)

const dryRun = process.argv.includes("--dry-run")

const run = async () => {
  loadMedusaEnv()
  requireMedusaCredentials()

  const token = await resolveAdminToken()
  const client = getMedusaClient(token)
  await verifyMedusaReachable(client)
  const raw = JSON.parse(await fs.readFile(normalizedPath, "utf8"))

  let updatedProducts = 0
  let missingProducts = 0
  let unchangedProducts = 0
  let renamedProducts = 0

  for (const catalogProduct of raw.products) {
    const { existing, legacyHandle } = await fetchCatalogProduct(client, catalogProduct.handle)
    if (!existing) {
      missingProducts += 1
      console.warn(`Missing in Medusa (skipped): ${catalogProduct.handle}`)
      continue
    }

    if (legacyHandle) {
      renamedProducts += 1
      console.log(`Matched legacy handle ${legacyHandle} -> ${catalogProduct.handle}`)
    }

    const batch = buildVariantBatch(existing, catalogProduct)
    const hasChanges =
      batch.create.length > 0 || batch.update.length > 0 || batch.delete.length > 0

    if (!hasChanges) {
      unchangedProducts += 1
      continue
    }

    const categoryId = await ensureCategory(client, catalogProduct.category)
    const productPayload = {
      title: catalogProduct.title,
      handle: catalogProduct.handle,
      subtitle: "Research Use Only",
      categories: [{ id: categoryId }],
      metadata: {
        ...catalogProduct.metadata,
        visual_type: catalogProduct.visual_type,
        source_category: catalogProduct.category
      },
      options: buildProductOptions(catalogProduct)
    }

    if (dryRun) {
      console.log(
        `[dry-run] ${catalogProduct.handle}${isMergedCatalogProduct(catalogProduct) ? " (merged)" : ""}: +${batch.create.length} ~${batch.update.length} -${batch.delete.length}`
      )
      updatedProducts += 1
      continue
    }

    await client.post(`/admin/products/${existing.id}`, productPayload)
    await client.post(`/admin/products/${existing.id}/variants/batch`, batch)

    updatedProducts += 1
    console.log(
      `Updated ${catalogProduct.handle}: +${batch.create.length} ~${batch.update.length} -${batch.delete.length}`
    )
  }

  console.log(
    `Catalog update complete. Updated ${updatedProducts}, unchanged ${unchangedProducts}, renamed ${renamedProducts}, missing ${missingProducts}${dryRun ? " (dry-run)" : ""}.`
  )

  if (!dryRun) {
    await syncTypesenseAfterChanges(updatedProducts)
  }
}

run().catch((error) => {
  console.error("Update failed:", formatAxiosError(error))
  process.exit(1)
})
