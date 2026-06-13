/**
 * Build packages/catalog/data/coa/manifest.json from catalog.normalized.json.
 * One COA + HPLC row per variant (batch A001). Add local_file per entry for real PDFs/images.
 *
 * Usage:
 *   npm run coa:manifest:generate
 *   npm run coa:manifest:generate -- --merge   # keep custom entries not in catalog
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const catalogPath = path.join(workspaceRoot, "packages", "catalog", "output", "catalog.normalized.json")
const manifestPath = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "manifest.json")

const merge = process.argv.includes("--merge")
const batchNumber = "A001"
const testedAt = "2026-06-01T00:00:00.000Z"
const defaultPurity = 99.0

function slugId(value) {
  return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase()
}

function buildEntry(product, variant, documentType) {
  const id = `${documentType}_${slugId(variant.handle)}_batch_${batchNumber.toLowerCase()}`
  return {
    id,
    product_handle: product.handle,
    variant_handle: variant.handle,
    batch_number: batchNumber,
    purity_percent: defaultPurity,
    tested_at: testedAt,
    document_type: documentType,
    metadata: {
      compound: product.title,
      variant: variant.title
    }
  }
}

async function run() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"))
  const products = catalog.products || []

  const generated = []
  for (const product of products) {
    for (const variant of product.variants || []) {
      generated.push(buildEntry(product, variant, "coa"))
      generated.push(buildEntry(product, variant, "hplc"))
    }
  }

  let manifest = generated

  if (merge) {
    try {
      const existing = JSON.parse(await fs.readFile(manifestPath, "utf8"))
      const generatedIds = new Set(generated.map((entry) => entry.id))
      const custom = existing.filter((entry) => !generatedIds.has(entry.id))
      manifest = [...custom, ...generated]
    } catch {
      // no existing manifest
    }
  }

  manifest.sort((a, b) => a.id.localeCompare(b.id))
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
  console.log(`Wrote ${manifest.length} manifest entries (${products.length} products) to ${manifestPath}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
