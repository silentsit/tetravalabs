/**
 * Add missing 1-vial pack variants on live Medusa products.
 *
 * Compound parents in catalog.normalized.json may not exist in Medusa yet;
 * this script expands them onto legacy strength handles (e.g. tb500-10mg)
 * and creates the missing "1 vial" SKU from catalog pricing.
 *
 * Usage:
 *   node scripts/ensure-1-vial-packs.mjs --dry-run
 *   node scripts/ensure-1-vial-packs.mjs
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  buildVariantBatch,
  isMergedCatalogProduct,
  packQtyFromVariant
} from "../lib/catalog-medusa-options.mjs"
import { PACK_OPTION } from "../lib/compound-merge.mjs"
import {
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

/** Flatten catalog rows onto the Medusa handles that currently exist (legacy strength SKUs). */
function expandCatalogByMedusaHandle(catalogProducts) {
  /** @type {Map<string, { handle: string, title: string, category: string, variants: any[] }>} */
  const byHandle = new Map()

  for (const product of catalogProducts) {
    if (isMergedCatalogProduct(product)) {
      const groups = new Map()
      for (const variant of product.variants) {
        const legacy = String(variant.metadata?.legacy_product_handle || "").trim()
        if (!legacy) continue
        if (!groups.has(legacy)) groups.set(legacy, [])
        groups.get(legacy).push({
          ...variant,
          metadata: {
            ...variant.metadata,
            // Match unmerged Medusa products by pack_qty only.
            compound_merged: undefined,
            compound_parent_handle: undefined
          }
        })
      }
      for (const [handle, variants] of groups) {
        byHandle.set(handle, {
          handle,
          title: product.title,
          category: product.category,
          variants: variants.sort(
            (a, b) => Number(a.metadata.pack_qty) - Number(b.metadata.pack_qty)
          )
        })
      }
      continue
    }

    byHandle.set(product.handle, {
      handle: product.handle,
      title: product.title,
      category: product.category,
      variants: product.variants
    })
  }

  return byHandle
}

function hasPackQty(product, qty) {
  return (product.variants || []).some((variant) => packQtyFromVariant(variant) === qty)
}

const run = async () => {
  loadMedusaEnv()
  requireMedusaCredentials()

  const token = await resolveAdminToken()
  const client = getMedusaClient(token)
  await verifyMedusaReachable(client)

  const raw = JSON.parse(await fs.readFile(normalizedPath, "utf8"))
  const catalogByHandle = expandCatalogByMedusaHandle(raw.products)

  let created = 0
  let updatedProducts = 0
  let skippedHasOne = 0
  let missingCatalog = 0
  let missingMedusa = 0

  for (const [handle, catalogProduct] of catalogByHandle) {
    const oneVial = catalogProduct.variants.find((v) => Number(v.metadata?.pack_qty) === 1)
    if (!oneVial) continue

    const response = await client.get("/admin/products", {
      params: {
        handle,
        limit: 1,
        fields: "id,handle,title,metadata,*variants,*variants.metadata,*variants.prices,*options"
      }
    })
    const existing = response.data?.products?.[0]
    if (!existing) {
      missingMedusa += 1
      continue
    }

    if (hasPackQty(existing, 1)) {
      skippedHasOne += 1
      continue
    }

    if (!hasPackQty(existing, 5) && !hasPackQty(existing, 10)) {
      // Not a pack-tier product (or empty) — leave alone.
      missingCatalog += 1
      continue
    }

    // Only create the missing 1-vial row; leave existing 5/10 pricing as-is.
    const slimCatalog = {
      ...catalogProduct,
      variants: catalogProduct.variants.filter((v) =>
        [1, 5, 10].includes(Number(v.metadata?.pack_qty))
      )
    }
    const batch = buildVariantBatch(existing, slimCatalog)
    const createOnly = {
      create: batch.create.filter((row) => Number(row.metadata?.pack_qty) === 1),
      update: [],
      delete: []
    }

    if (!createOnly.create.length) {
      missingCatalog += 1
      continue
    }

    const packOption = (existing.options || []).find((option) => option.title === PACK_OPTION)
    const existingValues = (packOption?.values || [])
      .map((value) => (typeof value === "string" ? value : value.value))
      .filter(Boolean)
    const nextPackValues = [...new Set(["1 vial", ...existingValues, "5 vials", "10 vials"])]

    if (dryRun) {
      console.log(
        `[dry-run] ${handle}: create ${createOnly.create.map((v) => `${v.title} $${(v.prices[0].amount / 100).toFixed(2)}`).join(", ")}`
      )
      created += createOnly.create.length
      updatedProducts += 1
      continue
    }

    await client.post(`/admin/products/${existing.id}`, {
      options: [{ title: PACK_OPTION, values: nextPackValues }]
    })
    await client.post(`/admin/products/${existing.id}/variants/batch`, createOnly)

    created += createOnly.create.length
    updatedProducts += 1
    console.log(
      `Added 1 vial on ${handle}: $${(createOnly.create[0].prices[0].amount / 100).toFixed(2)} (${createOnly.create[0].sku})`
    )
  }

  console.log(
    `Done. products=${updatedProducts} variants_created=${created} already_had_1=${skippedHasOne} no_medusa=${missingMedusa} skipped_other=${missingCatalog}${dryRun ? " (dry-run)" : ""}`
  )

  if (!dryRun) {
    await syncTypesenseAfterChanges(updatedProducts)
  }
}

run().catch((error) => {
  console.error("ensure-1-vial-packs failed:", formatAxiosError(error))
  process.exit(1)
})
