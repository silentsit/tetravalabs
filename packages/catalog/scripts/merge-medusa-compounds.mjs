/**
 * Merge per-strength Medusa products into compound parent products (Phase B).
 *
 * Prerequisites:
 *   npm run catalog:normalize
 *
 * Usage:
 *   npm run catalog:merge-compounds -- --dry-run
 *   npm run catalog:merge-compounds
 *
 * Requires MEDUSA admin credentials and DATABASE_URL (for COA + review remap).
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"
import pg from "pg"
import {
  buildProductOptions,
  buildVariantBatch,
  catalogVariantPayload,
  isMergedCatalogProduct
} from "../lib/catalog-medusa-options.mjs"
import {
  ensureCategory,
  formatAxiosError,
  getMedusaClient,
  loadMedusaEnv,
  requireMedusaCredentials,
  resolveAdminToken,
  resolveSalesChannelId,
  syncTypesenseAfterChanges,
  verifyMedusaReachable
} from "../lib/medusa-admin.mjs"

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const medusaRoot = path.join(workspaceRoot, "apps", "medusa")
const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)
const remapOutputPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "compound-variant-remap.json"
)

const { applyDatabaseUrlEnv, pgSslOptions } = require(path.join(
  medusaRoot,
  "src/lib/database-url.cjs"
))

const dryRun = process.argv.includes("--dry-run")

const fetchProductDetailed = async (client, handle) => {
  const response = await client.get("/admin/products", {
    params: {
      handle,
      limit: 1,
      fields: "id,handle,title,metadata,*variants,*variants.prices,*variants.metadata,*options"
    }
  })
  return response.data?.products?.[0] || null
}

const collectLegacyHandles = (catalogProduct) => {
  const handles = new Set()
  for (const variant of catalogProduct.variants) {
    const legacy = variant.metadata?.legacy_product_handle
    if (legacy) handles.add(legacy)
  }
  return [...handles]
}

const buildSkuVariantMap = (product) => {
  const map = new Map()
  for (const variant of product?.variants || []) {
    if (variant.sku) map.set(variant.sku, variant.id)
  }
  return map
}

const run = async () => {
  loadMedusaEnv()
  requireMedusaCredentials()

  const catalog = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  const mergedProducts = catalog.products.filter(isMergedCatalogProduct)

  if (!mergedProducts.length) {
    console.log("No compound_merged products in catalog.normalized.json — run catalog:normalize first.")
    return
  }

  const token = await resolveAdminToken()
  const client = getMedusaClient(token)
  await verifyMedusaReachable(client)
  const salesChannelId = await resolveSalesChannelId(client)

  const globalRemap = {}
  let mergedCount = 0
  let deletedLegacy = 0

  for (const catalogProduct of mergedProducts) {
    const legacyHandles = collectLegacyHandles(catalogProduct)
    const legacyProducts = (
      await Promise.all(legacyHandles.map((handle) => fetchProductDetailed(client, handle)))
    ).filter(Boolean)

    if (!legacyProducts.length) {
      console.warn(`Skip ${catalogProduct.handle}: no legacy Medusa products found (${legacyHandles.join(", ")})`)
      continue
    }

    let parent = await fetchProductDetailed(client, catalogProduct.handle)

    if (!parent) {
      const categoryId = await ensureCategory(client, catalogProduct.category)
      const payload = {
        title: catalogProduct.title,
        subtitle: "Research Use Only",
        handle: catalogProduct.handle,
        status: "published",
        categories: [{ id: categoryId }],
        metadata: {
          ...catalogProduct.metadata,
          visual_type: catalogProduct.visual_type,
          source_category: catalogProduct.category
        },
        options: buildProductOptions(catalogProduct),
        variants: catalogProduct.variants.map((variant) =>
          catalogVariantPayload(variant, true)
        ),
        sales_channels: [{ id: salesChannelId }]
      }

      if (dryRun) {
        console.log(`[dry-run] create parent ${catalogProduct.handle} (+${catalogProduct.variants.length} variants)`)
        mergedCount += 1
        continue
      }

      await client.post("/admin/products", payload)
      parent = await fetchProductDetailed(client, catalogProduct.handle)
      console.log(`Created parent ${catalogProduct.handle}`)
    } else {
      const batch = buildVariantBatch(parent, catalogProduct)
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
          `[dry-run] update parent ${catalogProduct.handle}: +${batch.create.length} ~${batch.update.length} -${batch.delete.length}`
        )
      } else {
        await client.post(`/admin/products/${parent.id}`, productPayload)
        await client.post(`/admin/products/${parent.id}/variants/batch`, batch)
        parent = await fetchProductDetailed(client, catalogProduct.handle)
        console.log(
          `Updated parent ${catalogProduct.handle}: +${batch.create.length} ~${batch.update.length} -${batch.delete.length}`
        )
      }
    }

    if (dryRun) {
      mergedCount += 1
      continue
    }

    if (!parent) {
      console.warn(`Parent ${catalogProduct.handle} missing after create/update`)
      continue
    }

    const newBySku = buildSkuVariantMap(parent)
    const variantIdMap = new Map()
    const remapEntry = { parentHandle: catalogProduct.handle, parentProductId: parent.id, variants: {} }

    for (const legacyProduct of legacyProducts) {
      for (const variant of legacyProduct.variants || []) {
        const newId = newBySku.get(variant.sku)
        if (newId && newId !== variant.id) {
          variantIdMap.set(variant.id, newId)
          remapEntry.variants[variant.sku] = { from: variant.id, to: newId }
        }
      }
    }

    globalRemap[catalogProduct.handle] = remapEntry

    if (process.env.DATABASE_URL) {
      applyDatabaseUrlEnv()
      const pgClient = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: pgSslOptions(process.env.DATABASE_URL)
      })
      await pgClient.connect()
      let coas = 0
      let reviews = 0
      try {
        for (const [oldId, newId] of variantIdMap.entries()) {
          const result = await pgClient.query(
            `UPDATE lab_batch_documents SET variant_id = $1 WHERE variant_id = $2`,
            [newId, oldId]
          )
          coas += result.rowCount || 0
        }

        const reviewResult = await pgClient.query(
          `
          UPDATE product_reviews
          SET product_id = $1, product_handle = $2, updated_at = NOW()
          WHERE product_handle = ANY($3::text[])
          `,
          [parent.id, catalogProduct.handle, legacyHandles]
        )
        reviews += reviewResult.rowCount || 0
      } finally {
        await pgClient.end()
      }
      console.log(`  Remapped ${coas} COA rows, ${reviews} reviews`)
    }

    for (const legacyProduct of legacyProducts) {
      if (legacyProduct.handle === catalogProduct.handle) continue
      await client.delete(`/admin/products/${legacyProduct.id}`)
      deletedLegacy += 1
      console.log(`  Deleted legacy ${legacyProduct.handle}`)
    }

    mergedCount += 1
  }

  if (!dryRun) {
    await fs.mkdir(path.dirname(remapOutputPath), { recursive: true })
    await fs.writeFile(remapOutputPath, `${JSON.stringify(globalRemap, null, 2)}\n`, "utf8")
    await syncTypesenseAfterChanges(mergedCount)
  }

  console.log(
    `Compound merge complete. Parents ${mergedCount}, legacy deleted ${deletedLegacy}${dryRun ? " (dry-run)" : ""}.`
  )
}

run().catch((error) => {
  console.error("Compound merge failed:", formatAxiosError(error))
  process.exit(1)
})
