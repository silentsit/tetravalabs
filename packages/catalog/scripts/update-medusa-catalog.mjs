/**
 * Update existing Medusa products with normalized catalog pack tiers (5/10/20 vials).
 * Creates missing variants, updates prices/metadata, removes obsolete tiers (e.g. 1 vial).
 *
 * Usage:
 *   npm run catalog:update
 *   npm run catalog:update -- --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
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
const PACK_OPTION = "Pack Size"

const packQtyFromMedusaVariant = (variant) => {
  const fromMeta = variant.metadata?.pack_qty
  if (fromMeta != null && Number(fromMeta) > 0) return Number(fromMeta)

  const titleMatch = String(variant.title || "").match(/^(\d+)\s+vials?$/i)
  if (titleMatch) return Number(titleMatch[1])

  const skuMatch = String(variant.sku || "").match(/_(\d+)PK$/i)
  if (skuMatch) return Number(skuMatch[1])

  return null
}

const catalogVariantPayload = (variant) => ({
  title: variant.title,
  sku: variant.sku,
  manage_inventory: false,
  options: { [PACK_OPTION]: variant.title },
  prices: [
    {
      amount: Math.round(variant.amount_usd * 100),
      currency_code: variant.currency_code || "usd"
    }
  ],
  metadata: variant.metadata
})

const isPackTierVariant = (variant) => {
  if (packQtyFromMedusaVariant(variant) != null) return true
  return /^\d+\s+vials?$/i.test(String(variant.title || ""))
}

const buildVariantBatch = (existingProduct, catalogProduct) => {
  const existingVariants = existingProduct.variants || []
  const catalogQtys = new Set(catalogProduct.variants.map((v) => v.metadata.pack_qty))

  const byQty = new Map()
  for (const variant of existingVariants) {
    const qty = packQtyFromMedusaVariant(variant)
    if (qty != null && !byQty.has(qty)) {
      byQty.set(qty, variant)
    }
  }

  const create = []
  const update = []
  const deleteIds = []

  for (const catalogVariant of catalogProduct.variants) {
    const qty = catalogVariant.metadata.pack_qty
    const existing = byQty.get(qty)

    if (existing) {
      update.push({
        id: existing.id,
        ...catalogVariantPayload(catalogVariant)
      })
    } else {
      create.push(catalogVariantPayload(catalogVariant))
    }
  }

  for (const variant of existingVariants) {
    if (!isPackTierVariant(variant)) continue
    const qty = packQtyFromMedusaVariant(variant)
    if (qty == null || !catalogQtys.has(qty)) {
      deleteIds.push(variant.id)
    }
  }

  return { create, update, delete: deleteIds }
}

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
      options: [
        {
          title: PACK_OPTION,
          values: catalogProduct.variants.map((variant) => variant.title)
        }
      ]
    }

    if (dryRun) {
      console.log(
        `[dry-run] ${catalogProduct.handle}: +${batch.create.length} ~${batch.update.length} -${batch.delete.length}`
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
