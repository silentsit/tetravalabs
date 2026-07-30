/**
 * Wire dataset PDFs into coas/manifest.json.
 *
 * Usage:
 *   node tools/coa-replicate/wire-generated-coas.mjs
 *   node tools/coa-replicate/wire-generated-coas.mjs --dry-run
 *   node tools/coa-replicate/wire-generated-coas.mjs --replace-generated
 */
import fs from "node:fs/promises"
import path from "node:path"
import {
  listDatasetFiles,
  loadJson,
  loadManifest,
  writeJson
} from "./lib/coa-utils.mjs"
import { COA_FILES_DIR, DATASETS_DIR, MANIFEST_PATH } from "./lib/paths.mjs"

const dryRun = process.argv.includes("--dry-run")
const replaceGenerated = process.argv.includes("--replace-generated")

function purityFromDataset(dataset) {
  const row = (dataset.results || []).find((r) => /purity|assay/i.test(r.test))
  if (!row) return dataset.hplc?.purity_area_percent ?? 99
  const m = String(row.result).match(/([\d.]+)/)
  return m ? Number(m[1]) : 99
}

function testedAtFromDataset(dataset) {
  const d = dataset.tester?.test_date
  if (!d || d === "TBD") return new Date().toISOString()
  return `${d}T00:00:00.000Z`
}

function manifestId(variantHandle, batch = "a001") {
  return `coa_${variantHandle.replace(/-/g, "_")}_batch_${batch}`
}

async function main() {
  const manifest = await loadManifest()
  const files = await listDatasetFiles()
  let wired = 0
  let created = 0
  const warnings = []

  for (const file of files) {
    const dataset = await loadJson(path.join(DATASETS_DIR, file))
    if (!dataset?.variant_handle || !dataset.output?.pdf_filename) continue

    const pdfPath = path.join(COA_FILES_DIR, dataset.output.pdf_filename)
    try {
      await fs.access(pdfPath)
    } catch {
      warnings.push(`missing PDF for ${dataset.variant_handle}: ${dataset.output.pdf_filename}`)
      continue
    }

    let entry = manifest.find(
      (e) => e.document_type === "coa" && e.variant_handle === dataset.variant_handle
    )

    const existingSource = entry?.metadata?.source
    if (
      entry?.local_file &&
      existingSource !== "generated" &&
      !replaceGenerated &&
      dataset.source === "generated"
    ) {
      // Do not overwrite real Morgan/foxit wiring
      console.log(`[keep] ${dataset.variant_handle} already wired (${entry.local_file})`)
      continue
    }

    if (!entry) {
      entry = {
        id: manifestId(dataset.variant_handle),
        product_handle: dataset.product_handle,
        variant_handle: dataset.variant_handle,
        batch_number: "A001",
        purity_percent: Math.round(purityFromDataset(dataset)),
        tested_at: testedAtFromDataset(dataset),
        document_type: "coa",
        metadata: {
          compound: dataset.product?.chemical_name?.split("(")[0]?.trim() || dataset.product_handle,
          variant: dataset.variant_handle.split("-").slice(-1)[0]
        }
      }
      manifest.push(entry)
      created++
    }

    entry.local_file = dataset.output.pdf_filename
    entry.purity_percent = Math.round(purityFromDataset(dataset))
    entry.tested_at = testedAtFromDataset(dataset)
    entry.metadata = {
      ...(entry.metadata || {}),
      source: dataset.source,
      source_filename: dataset.output.pdf_filename,
      form: dataset.form || "injectable"
    }
    wired++
    console.log(`[wire] ${dataset.variant_handle} -> ${dataset.output.pdf_filename} (${dataset.source})`)
  }

  if (!dryRun) {
    manifest.sort((a, b) => a.id.localeCompare(b.id))
    await writeJson(MANIFEST_PATH, manifest)
  }

  console.log(`Wired ${wired} (created ${created}). warnings=${warnings.length}`)
  for (const w of warnings.slice(0, 30)) console.warn(`  ${w}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
