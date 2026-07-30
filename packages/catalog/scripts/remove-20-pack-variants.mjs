/**
 * Delete retired 20-vial pack variants from every Medusa product.
 *
 * Usage:
 *   node scripts/remove-20-pack-variants.mjs --dry-run
 *   node scripts/remove-20-pack-variants.mjs
 */

import {
  formatAxiosError,
  getMedusaClient,
  loadMedusaEnv,
  requireMedusaCredentials,
  resolveAdminToken,
  syncTypesenseAfterChanges
} from "../lib/medusa-admin.mjs"
import { packQtyFromVariant } from "../lib/catalog-medusa-options.mjs"

const dryRun = process.argv.includes("--dry-run")
const RETIRED_QTY = 20

function isRetiredPackVariant(variant) {
  const qty = packQtyFromVariant(variant)
  if (qty === RETIRED_QTY) return true
  return /^20\s+vials?$/i.test(String(variant.title || "").trim())
}

const run = async () => {
  loadMedusaEnv()
  requireMedusaCredentials()

  const token = await resolveAdminToken()
  const client = getMedusaClient(token)

  const products = []
  let offset = 0
  while (true) {
    const response = await client.get("/admin/products", {
      params: {
        limit: 100,
        offset,
        fields: "id,handle,title,*variants,*variants.metadata,*options"
      }
    })
    const batch = response.data?.products || []
    products.push(...batch)
    if (batch.length < 100) break
    offset += 100
  }

  let productsTouched = 0
  let variantsDeleted = 0

  for (const product of products) {
    const retired = (product.variants || []).filter(isRetiredPackVariant)
    if (!retired.length) continue

    productsTouched += 1
    const ids = retired.map((v) => v.id)

    if (dryRun) {
      console.log(
        `[dry-run] ${product.handle}: delete ${ids.length} × 20-vial (${retired
          .map((v) => v.title)
          .join(", ")})`
      )
      variantsDeleted += ids.length
      continue
    }

    await client.post(`/admin/products/${product.id}/variants/batch`, {
      delete: ids
    })

    // Drop "20 vials" from Pack Size option values when present.
    const options = (product.options || []).map((option) => {
      const values = (option.values || [])
        .map((v) => (typeof v === "string" ? v : v.value))
        .filter((value) => value && !/^20\s+vials?$/i.test(value))
      return { title: option.title, values: [...new Set(values)] }
    })
    if (options.length) {
      await client.post(`/admin/products/${product.id}`, { options })
    }

    variantsDeleted += ids.length
    console.log(`Removed ${ids.length} × 20-vial from ${product.handle}`)
  }

  console.log(
    `Done. Products touched: ${productsTouched}, 20-vial variants removed: ${variantsDeleted}${
      dryRun ? " (dry-run)" : ""
    }.`
  )

  if (!dryRun && variantsDeleted > 0) {
    await syncTypesenseAfterChanges(productsTouched)
  }
}

run().catch((error) => {
  console.error("Remove 20-pack failed:", formatAxiosError(error))
  process.exit(1)
})
