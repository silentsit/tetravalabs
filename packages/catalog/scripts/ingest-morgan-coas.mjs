/**
 * Copy Morgan COA PDFs into packages/catalog/data/coa/files and wire manifest local_file.
 *
 * Source folder (override with MORGAN_COA_SOURCE):
 *   C:/Users/user/Downloads/COA for Morgan/compressed
 *
 * Usage:
 *   node packages/catalog/scripts/ingest-morgan-coas.mjs
 *   node packages/catalog/scripts/ingest-morgan-coas.mjs --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const manifestPath = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "manifest.json")
const filesDir = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "files")
const pendingDir = path.join(filesDir, "_pending")

const defaultSource = path.join(
  process.env.USERPROFILE || process.env.HOME || "",
  "Downloads",
  "COA for Morgan",
  "compressed"
)
const sourceDir = process.env.MORGAN_COA_SOURCE || defaultSource
const dryRun = process.argv.includes("--dry-run")

/** GLP-2 TR = retatrutide (triple agonist) in supplier labeling. */
const CATALOG_MAPPINGS = [
  {
    source: "COA_5-Amino-1MQ_10mg_Injectable.pdf",
    dest: "5-amino-1mq-10mg.pdf",
    manifestId: "coa_5_amino_1mq_10mg_batch_a001"
  },
  {
    source: "COA_Adipotide_5mg.pdf",
    dest: "adipotide-5mg.pdf",
    manifestId: "coa_adipotide_5mg_batch_a001"
  },
  {
    source: "COA_AOD-9604_5mg.pdf",
    dest: "aod-9604-5mg.pdf",
    manifestId: "coa_aod_9604_5mg_batch_a001"
  },
  {
    source: "COA_BPC-157_10mg.pdf",
    dest: "bpc-157-10mg.pdf",
    manifestId: "coa_bpc_157_10mg_batch_a001"
  },
  {
    source: "COA_BPC-157_500mcg_Tablet.pdf",
    dest: "bpc-157-capsules-500mcg.pdf",
    manifestId: "coa_bpc_157_capsules_100ct_batch_a001"
  },
  {
    source: "COA_BPC-157_5mg.pdf",
    dest: "bpc-157-5mg.pdf",
    manifestId: "coa_bpc_157_5mg_batch_a001"
  },
  {
    source: "COA_Cagrilintide_10mg.pdf",
    dest: "cagrilintide-10mg.pdf",
    manifestId: "coa_cagrilintide_10mg_batch_a001"
  },
  {
    source: "COA_Cagrilintide_5mg.pdf",
    dest: "cagrilintide-5mg.pdf",
    manifestId: "coa_cagrilintide_5mg_batch_a001"
  },
  {
    source: "COA_DSIP_10mg.pdf",
    dest: "dsip-10mg.pdf",
    manifestId: "coa_dsip_10mg_batch_a001"
  },
  {
    source: "COA_Epithalon_10mg.pdf",
    dest: "epithalon-10mg.pdf",
    manifestId: "coa_epithalon_10mg_batch_a001"
  },
  {
    source: "COA_GHK-Cu_50mg.pdf",
    dest: "ghk-cu-50mg.pdf",
    manifestId: "coa_ghk_cu_50mg_batch_a001"
  },
  {
    source: "COA_GLP-2_TR_5mg.pdf",
    dest: "retatrutide-5mg.pdf",
    manifestId: "coa_retatrutide_5mg_batch_a001"
  },
  {
    source: "COA_GLP-2_TR_10mg.pdf",
    dest: "retatrutide-10mg.pdf",
    manifestId: "coa_retatrutide_10mg_batch_a001"
  },
  {
    source: "COA_GLP-2_TR_20mg.pdf",
    dest: "retatrutide-20mg.pdf",
    manifestId: "coa_retatrutide_20mg_batch_a001"
  }
]

const PENDING_MAPPINGS = [
  { source: "COA_5-Amino-1MQ_50mg_Injectable.pdf", dest: "5-amino-1mq-50mg-injectable.pdf" },
  { source: "COA_5-Amino-1MQ_50mg_Tablet.pdf", dest: "5-amino-1mq-50mg-tablet.pdf" },
  { source: "COA_AHK-Cu_100mg.pdf", dest: "ahk-cu-100mg.pdf" },
  { source: "COA_BPC-157_KPV_250mcg_Tablet.pdf", dest: "bpc-157-kpv-250mcg-tablet.pdf" },
  { source: "COA_Cerebroprotein_Hydrolysate_60mg.pdf", dest: "cerebroprotein-hydrolysate-60mg.pdf" },
  { source: "COA_Cortagen_20mg.pdf", dest: "cortagen-20mg.pdf" }
]

async function copyFile(from, to) {
  if (dryRun) {
    console.log(`[dry-run] copy ${path.basename(from)} -> ${path.relative(workspaceRoot, to)}`)
    return
  }
  await fs.mkdir(path.dirname(to), { recursive: true })
  await fs.copyFile(from, to)
  console.log(`[copy] ${path.basename(from)} -> ${path.relative(filesDir, to)}`)
}

async function run() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
  const byId = new Map(manifest.map((entry) => [entry.id, entry]))

  for (const mapping of CATALOG_MAPPINGS) {
    const from = path.join(sourceDir, mapping.source)
    const to = path.join(filesDir, mapping.dest)

    try {
      await fs.access(from)
    } catch {
      console.warn(`[skip] missing source file: ${mapping.source}`)
      continue
    }

    await copyFile(from, to)

    const entry = byId.get(mapping.manifestId)
    if (!entry) {
      console.warn(`[warn] manifest id not found: ${mapping.manifestId}`)
      continue
    }

    entry.local_file = mapping.dest
    entry.metadata = {
      ...(entry.metadata || {}),
      source_filename: mapping.source
    }
  }

  for (const mapping of PENDING_MAPPINGS) {
    const from = path.join(sourceDir, mapping.source)
    const to = path.join(pendingDir, mapping.dest)

    try {
      await fs.access(from)
    } catch {
      console.warn(`[skip] missing pending source: ${mapping.source}`)
      continue
    }

    await copyFile(from, to)
  }

  if (!dryRun) {
    const sorted = [...manifest].sort((a, b) => a.id.localeCompare(b.id))
    await fs.writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8")
    console.log(`\nUpdated manifest with ${CATALOG_MAPPINGS.length} local_file entries.`)
    console.log(`Pending (no catalog SKU yet): ${PENDING_MAPPINGS.length} file(s) in files/_pending/`)
  } else {
    console.log(`\nDry run complete (${CATALOG_MAPPINGS.length} catalog + ${PENDING_MAPPINGS.length} pending).`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
