/**
 * Add COA/HPLC manifest rows for catalog products that have local PDFs but no manifest entry.
 *
 * Usage:
 *   node packages/catalog/scripts/add-coa-manifest-entries.mjs
 *   node packages/catalog/scripts/add-coa-manifest-entries.mjs --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const catalogPath = path.join(workspaceRoot, "packages", "catalog", "output", "catalog.normalized.json")
const manifestPath = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "manifest.json")
const filesDir = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "files")
const dryRun = process.argv.includes("--dry-run")

const batchNumber = "A001"
const testedAt = "2026-06-01T00:00:00.000Z"
const defaultPurity = 99

/** Catalog variant_handle -> Morgan PDF in files/ */
const PDF_BY_VARIANT = {
  "pinealon-10mg": "COA_Pinealon_10mg.pdf",
  "cerebrolysin-10mg": "COA_Cerebroprotein_Hydrolysate_60mg.pdf"
}

function slugId(value) {
  return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase()
}

function productHandleFromVariant(variantHandle) {
  const match = variantHandle.match(/^(.+)-(\d+(?:\.\d+)?(?:mg|mcg|ml|iu|count|ct))$/i)
  return match ? match[1] : variantHandle
}

function buildEntry(product, documentType, localFile) {
  const variantHandle = product.handle
  const id = `${documentType}_${slugId(variantHandle)}_batch_${batchNumber.toLowerCase()}`
  const entry = {
    id,
    product_handle: productHandleFromVariant(variantHandle),
    variant_handle: variantHandle,
    batch_number: batchNumber,
    purity_percent: defaultPurity,
    tested_at: testedAt,
    document_type: documentType,
    metadata: {
      compound: product.title.replace(/\s+\d.*$/, "").trim() || product.title,
      variant: product.metadata?.strength || product.title
    }
  }

  if (documentType === "coa" && localFile) {
    entry.local_file = localFile
    entry.metadata.source_filename = localFile
  }

  return entry
}

async function run() {
  const catalog = JSON.parse(await fs.readFile(catalogPath, "utf8"))
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
  const byId = new Map(manifest.map((entry) => [entry.id, entry]))
  const coaByVariant = new Map(
    manifest.filter((entry) => entry.document_type === "coa").map((entry) => [entry.variant_handle, entry])
  )
  const productsByHandle = new Map(catalog.products.map((product) => [product.handle, product]))

  let added = 0
  let wired = 0

  for (const [variantHandle, pdfName] of Object.entries(PDF_BY_VARIANT)) {
    const product = productsByHandle.get(variantHandle)
    if (!product) {
      console.warn(`[skip] catalog product not found: ${variantHandle}`)
      continue
    }

    try {
      await fs.access(path.join(filesDir, pdfName))
    } catch {
      console.warn(`[skip] missing PDF: ${pdfName}`)
      continue
    }

    for (const documentType of ["coa", "hplc"]) {
      const entry = buildEntry(product, documentType, documentType === "coa" ? pdfName : null)
      if (byId.has(entry.id)) {
        if (documentType === "coa") {
          const existing = byId.get(entry.id)
          existing.local_file = pdfName
          existing.metadata = {
            ...(existing.metadata || {}),
            source_filename: pdfName
          }
          wired++
          console.log(`[wire] ${pdfName} -> ${entry.id}`)
        }
        continue
      }

      manifest.push(entry)
      byId.set(entry.id, entry)
      if (documentType === "coa") coaByVariant.set(variantHandle, entry)
      added++
      console.log(`[add] ${entry.id}${documentType === "coa" ? ` (${pdfName})` : ""}`)
    }
  }

  if (!dryRun && (added > 0 || wired > 0)) {
    manifest.sort((a, b) => a.id.localeCompare(b.id))
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
  }

  console.log(`\nAdded ${added} manifest row(s), wired ${wired} existing COA row(s)${dryRun ? " (dry run)" : ""}.`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
