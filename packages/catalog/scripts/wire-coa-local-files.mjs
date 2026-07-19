/**
 * Wire Morgan COA PDFs already in packages/catalog/data/coa/files/ to manifest local_file.
 *
 * Usage:
 *   node packages/catalog/scripts/wire-coa-local-files.mjs
 *   node packages/catalog/scripts/wire-coa-local-files.mjs --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const manifestPath = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "manifest.json")
const filesDir = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "files")
const dryRun = process.argv.includes("--dry-run")

/** Morgan source filename -> manifest variant_handle (COA document only). */
const FILE_TO_VARIANT = {
  "COA_5-Amino-1MQ_10mg_Injectable.pdf": "5-amino-1mq-10mg",
  "COA_Adipotide_5mg.pdf": "adipotide-5mg",
  "COA_AOD-9604_5mg.pdf": "aod-9604-5mg",
  "COA_BPC-157_10mg.pdf": "bpc-157-10mg",
  "COA_BPC-157_500mcg_Tablet.pdf": "bpc-157-capsules-100ct",
  "COA_BPC-157_5mg.pdf": "bpc-157-5mg",
  "COA_Cagrilintide_10mg.pdf": "cagrilintide-10mg",
  "COA_Cagrilintide_5mg.pdf": "cagrilintide-5mg",
  "COA_DSIP_10mg.pdf": "dsip-10mg",
  "COA_Epithalon_10mg.pdf": "epithalon-10mg",
  "COA_GHK-Cu_50mg.pdf": "ghk-cu-50mg",
  /** Supplier GLP-2 TR labeling = retatrutide. */
  "COA_GLP-2_TR_5mg.pdf": "retatrutide-5mg",
  "COA_GLP-2_TR_10mg.pdf": "retatrutide-10mg",
  "COA_GLP-2_TR_20mg.pdf": "retatrutide-20mg",
  /** Supplier GLP-3 RT labeling = tirzepatide (15/30mg map to nearest catalog strengths). */
  "COA_GLP-3_RT_5mg.pdf": "tirzepatide-5mg",
  "COA_GLP-3_RT_10mg.pdf": "tirzepatide-10mg",
  "COA_GLP-3_RT_15mg.pdf": "tirzepatide-20mg",
  "COA_GLP-3_RT_30mg.pdf": "tirzepatide-50mg",
  "COA_KPV_10mg.pdf": "kpv-10mg",
  "COA_Kisspeptin-10_10mg.pdf": "kisspeptin-10-10mg",
  "COA_L-Carnitine_500mg.pdf": "l-carnitine-600mg-10ml",
  "COA_LL-37_5mg.pdf": "ll-37-5mg",
  "COA_MOTS-C_10mg.pdf": "mots-c-10mg",
  "COA_MOTS-C_20mg.pdf": "mots-c-20mg",
  "COA_Melanotan_1_10mg.pdf": "melanotan-1-10mg",
  "COA_Melanotan_2_10mg.pdf": "melanotan-2-10mg",
  "COA_NAD__1000mg.pdf": "nad-plus-1000mg",
  "COA_NAD__100mg.pdf": "nad-plus-100mg",
  "COA_NAD__500mg.pdf": "nad-plus-500mg",
  "COA_Reduced_Glutathione_600mg.pdf": "glutathione-600mg",
  "COA_Reconstitution_Solution_10ml.pdf": "bacteriostatic-water-10ml",
  "COA_SS-31_10mg.pdf": "ss-31-10mg",
  "COA_SS-31_20mg.pdf": "ss-31-25mg",
  "COA_SS-31_30mg.pdf": "ss-31-50mg",
  "COA_Sermorelin_10mg.pdf": "sermorelin-10mg",
  "COA_Sermorelin_5mg.pdf": "sermorelin-5mg",
  "COA_Tesamorelin_10mg.pdf": "tesamorelin-10mg",
  "COA_Tesamorelin_5mg.pdf": "tesamorelin-5mg",
  "COA_Thymalin_10mg.pdf": "thymalin-10mg",
  "COA_Thymosin_Beta-4_TB-500_5mg (1).pdf": "tb500-5mg",
  "COA_Thymosin_Beta-4_TB-500_10mg.pdf": "tb500-10mg",
  "COA_Pinealon_10mg.pdf": "pinealon-10mg",
  "COA_Cerebroprotein_Hydrolysate_60mg.pdf": "cerebrolysin-10mg"
}

const UNMAPPED = [
  "COA_5-Amino-1MQ_50mg_Injectable.pdf",
  "COA_5-Amino-1MQ_50mg_Tablet.pdf",
  "COA_AHK-Cu_100mg.pdf",
  "COA_BPC-157_KPV_250mcg_Tablet.pdf",
  "COA_Cortagen_20mg.pdf",
  "COA_HGH_Fragment_176-191_5mg.pdf",
  "COA_TB-500_Fragment_10mg.pdf",
  "COA_KPV_500mcg_Tablet.pdf",
  "COA_Methylene_Blue_10mg_Tablet.pdf",
  "COA_N-Acetyl_Epitalon_Amidate_20mg.pdf",
  "COA_N-Acetyl_Selank_Amidate_20mg.pdf",
  "COA_N-Acetyl_Semax_Amidate_20mg.pdf",
  "COA_N-Acetyl_Semax_plus_Selank_Amidate_10mg_10mg.pdf",
  "COA_Ovagen_20mg.pdf",
  "COA_Progesterone_5mg.pdf",
  "COA_Prostamax_20mg.pdf",
  "COA_SLU-PP-332_20mg_Tablet.pdf",
  "COA_SLU-PP-332_50mg_Tablet.pdf",
  "COA_SLU-PP-332_5mg_Tablet.pdf",
  "COA_Tesamorelin_Ipamorelin_12mg_4mg.pdf",
  "COA_Tesofensine_500mcg_Tablet.pdf",
  "COA_Testagen_20mg.pdf"
]

async function run() {
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
  const coaByVariant = new Map(
    manifest.filter((entry) => entry.document_type === "coa").map((entry) => [entry.variant_handle, entry])
  )

  let wired = 0
  const warnings = []

  for (const [filename, variantHandle] of Object.entries(FILE_TO_VARIANT)) {
    const filePath = path.join(filesDir, filename)
    try {
      await fs.access(filePath)
    } catch {
      warnings.push(`missing file: ${filename}`)
      continue
    }

    const entry = coaByVariant.get(variantHandle)
    if (!entry) {
      warnings.push(`no manifest COA for variant ${variantHandle} (${filename})`)
      continue
    }

    entry.local_file = filename
    entry.metadata = {
      ...(entry.metadata || {}),
      source_filename: filename
    }
    wired++
    console.log(`[wire] ${filename} -> ${entry.id}`)
  }

  if (!dryRun) {
    manifest.sort((a, b) => a.id.localeCompare(b.id))
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
  }

  console.log(`\nWired ${wired} COA file(s)${dryRun ? " (dry run)" : ""}.`)
  if (warnings.length) {
    console.log(`\nWarnings (${warnings.length}):`)
    warnings.forEach((message) => console.log(`  - ${message}`))
  }
  if (UNMAPPED.length) {
    console.log(`\nUnmapped PDFs (${UNMAPPED.length}) — no catalog/manifest match yet:`)
    UNMAPPED.forEach((filename) => console.log(`  - ${filename}`))
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
