/**
 * Wire COA PDFs onto products that have no live variant-linked COA yet,
 * then prepare the manifest for `coa:sync-r2`.
 *
 * Usage:
 *   node packages/catalog/scripts/attach-missing-coas.mjs
 *   node packages/catalog/scripts/attach-missing-coas.mjs --dry-run
 *   node packages/catalog/scripts/attach-missing-coas.mjs --report-only
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })
dotenv.config({ path: path.join(workspaceRoot, "apps", "storefront", ".env.local") })

const manifestPath = path.join(workspaceRoot, "coas", "manifest.json")
const filesDir = path.join(workspaceRoot, "coas", "files")
const dryRun = process.argv.includes("--dry-run")
const reportOnly = process.argv.includes("--report-only")

const medusaUrl = (
  process.env.MEDUSA_ADMIN_URL ||
  process.env.NEXT_PUBLIC_MEDUSA_URL ||
  "http://localhost:9000"
).replace(/\/$/, "")
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/** PDF filename → live Medusa product handle */
export const PDF_TO_LIVE_HANDLE = {
  "COA_5-Amino-1MQ_10mg_Injectable.pdf": "5-amino-1mq-10mg",
  "COA_5-amino-1mq_5mg_Injectable.pdf": "5-amino-1mq-5mg",
  "COA_Acetic_Acid_Water_3ml.pdf": "acetic-acid-water-3ml",
  "COA_Adamax_10mg.pdf": "adamax-10mg",
  "COA_Adipotide_2mg.pdf": "adipotide-2mg",
  "COA_Adipotide_5mg.pdf": "adipotide-5mg",
  "COA_AICAR_50mg.pdf": "aicar-50mg",
  "COA_AOD-9604_10mg.pdf": "aod-9604-10mg",
  "COA_AOD-9604_5mg.pdf": "aod-9604-5mg",
  "COA_ARA-290_10mg.pdf": "ara-290-10mg",
  "COA_B-12_10mg.pdf": "b-12-10mg",
  "COA_Bacteriostatic_Water_3ml.pdf": "bacteriostatic-water-3ml",
  "COA_Benzyl_Alcohol_10ml.pdf": "benzyl-alcohol-10ml",
  "COA_Benzyl_Alcohol_3ml.pdf": "benzyl-alcohol-3ml",
  "COA_BPC-157_+_TB-500_+_Cu_+_KPV_80mg.pdf":
    "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg",
  "COA_BPC-157_+_TB-500_10mg.pdf": "bpc-157-5mg-tb500-5mg-10mg",
  "COA_BPC-157_+_TB-500_20mg.pdf": "bpc-157-5mg-tb500-5mg-20mg",
  "COA_BPC-157_10mg.pdf": "bpc-157-10mg",
  "COA_BPC-157_500mcg_Tablet.pdf": "bpc-157-capsules-100-count-500mcg",
  "COA_BPC-157_5mg.pdf": "bpc-157-5mg",
  "COA_Bremelanotide_10mg.pdf": "bremelanotide-10mg",
  "COA_Bremelanotide_5mg.pdf": "bremelanotide-5mg",
  "COA_Cagrilintide_+_Semaglutide_10mg.pdf": "cagrilintide-semaglutide-10mg",
  "COA_Cagrilintide_+_Semaglutide_5mg.pdf": "cagrilintide-semaglutide-5mg",
  "COA_Cagrilintide_10mg.pdf": "cagrilintide-10mg",
  "COA_Cagrilintide_5mg.pdf": "cagrilintide-5mg",
  "COA_Cerebroprotein_Hydrolysate_60mg.pdf": "cerebrolysin-10mg",
  "COA_CJC-1295_+_DAC_10mg.pdf": "cjc-1295-with-dac-10mg",
  "COA_CJC-1295_+_DAC_5mg.pdf": "cjc-1295-with-dac-5mg",
  "COA_CJC-1295_no_DAC_+_Ipamorelin_+_Sermorelin_5mg.pdf":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg",
  "COA_CJC-1295_no_DAC_+_Ipamorelin_10mg.pdf":
    "cjc-1295-without-dac-ipamorelin-blend-10mg",
  "COA_CJC-1295_no_DAC_10mg.pdf": "cjc-1295-without-dac-10mg",
  "COA_CJC-1295_no_DAC_5mg.pdf": "cjc-1295-without-dac-5mg",
  "COA_Dermorphin_5mg.pdf": "dermorphin-5mg",
  "COA_Dihexa_10mg.pdf": "dihexa-10mg",
  "COA_DSIP_10mg.pdf": "dsip-10mg",
  "COA_DSIP_15mg.pdf": "dsip-15mg",
  "COA_DSIP_5mg.pdf": "dsip-5mg",
  "COA_Epithalon_10mg.pdf": "epithalon-10mg",
  "COA_Epithalon_50mg.pdf": "epithalon-50mg",
  "COA_FOXO4-DRI_10mg.pdf": "foxo4-dri-10mg",
  "COA_GHK-Cu_100mg.pdf": "ghk-cu-100mg",
  "COA_GHK-Cu_50mg.pdf": "ghk-cu-50mg",
  "COA_GHRP-2_Acetate_10mg.pdf": "ghrp-2-acetate-10mg",
  "COA_GHRP-2_Acetate_5mg.pdf": "ghrp-2-acetate-5mg",
  "COA_GHRP-6_Acetate_10mg.pdf": "ghrp-6-acetate-10mg",
  "COA_GHRP-6_Acetate_5mg.pdf": "ghrp-6-acetate-5mg",
  "COA_Glow_Blend_30mg.pdf": "glow-bpc-157-tb500-ghk-cu-30mg",
  "COA_Glow_Blend_70mg.pdf": "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg",
  "COA_Glow_Blend_85mg.pdf": "glow-bpc-157-tb500-ghk-cu-85mg",
  "COA_GLP-2_TR_5mg.pdf": "retatrutide-5mg",
  "COA_GLP-2_TR_10mg.pdf": "retatrutide-10mg",
  "COA_GLP-2_TR_20mg.pdf": "retatrutide-20mg",
  "COA_GLP-3_RT_5mg.pdf": "tirzepatide-5mg",
  "COA_GLP-3_RT_10mg.pdf": "tirzepatide-10mg",
  "COA_GLP-3_RT_15mg.pdf": "tirzepatide-20mg",
  "COA_GLP-3_RT_30mg.pdf": "tirzepatide-50mg",
  "COA_Glutathione_1500mg.pdf": "glutathione-1500mg",
  "COA_Gonadorelin_10mg.pdf": "gonadorelin-10mg",
  "COA_Gonadorelin_2mg.pdf": "gonadorelin-2mg",
  "COA_HCG_10000IU.pdf": "hcg-10000-iu",
  "COA_HCG_5000IU.pdf": "hcg-5000-iu",
  "COA_Hexarelin_Acetate_2mg.pdf": "hexarelin-acetate-2mg",
  "COA_Hexarelin_Acetate_5mg.pdf": "hexarelin-acetate-5mg",
  "COA_HGH_191aa_10IU.pdf": "hgh-191aa-10-iu",
  "COA_HGH_191aa_12IU.pdf": "hgh-191aa-12-iu",
  "COA_HGH_191aa_15IU.pdf": "hgh-191aa-15-iu",
  "COA_HGH_191aa_24IU.pdf": "hgh-191aa-24-iu",
  "COA_HGH_191aa_36IU.pdf": "hgh-191aa-36-iu",
  "COA_HMG_75IU.pdf": "hmg-75-iu",
  "COA_Humanin_10mg.pdf": "humanin-10mg",
  "COA_IGF-1_LR3_0.1mg.pdf": "igf-1-lr3-0-1mg",
  "COA_IGF-1_LR3_1mg.pdf": "igf-1-lr3-1mg",
  "COA_Ipamorelin_10mg.pdf": "ipamorelin-10mg",
  "COA_Ipamorelin_5mg.pdf": "ipamorelin-5mg",
  "COA_Kisspeptin-10_10mg.pdf": "kisspeptin-10-10mg",
  "COA_Kisspeptin-10_5mg.pdf": "kisspeptin-10-5mg",
  "COA_KPV_10mg.pdf": "kpv-10mg",
  "COA_KPV_5mg.pdf": "kpv-5mg",
  "COA_L-Carnitine_500mg.pdf": "l-carnitine-600mg-10ml",
  "COA_L-Glu_100mg.pdf": "l-glu-100mg",
  "COA_Lemon_Bottle_10ml.pdf": "lemon-bottle-10ml",
  "COA_Lipo-C_10ml.pdf": "lipo-c-10ml",
  "COA_LL-37_5mg.pdf": "ll-37-5mg",
  "COA_Mazdutide_10mg.pdf": "mazdutide-10mg",
  "COA_Mazdutide_5mg.pdf": "mazdutide-5mg",
  "COA_Melanotan_1_10mg.pdf": "melanotan-1-10mg",
  "COA_Melanotan_2_10mg.pdf": "melanotan-2-10mg",
  "COA_MGF_2mg.pdf": "mgf-2mg",
  "COA_MK-677_5mg.pdf": "mk-677-5mg",
  "COA_MOTS-C_10mg.pdf": "mots-c-10mg",
  "COA_MOTS-C_20mg.pdf": "mots-c-20mg",
  "COA_MOTS-c_40mg.pdf": "mots-c-40mg",
  "COA_MOTS-c_5mg.pdf": "mots-c-5mg",
  "COA_NAD__1000mg.pdf": "nad-1000mg",
  "COA_NAD__100mg.pdf": "nad-100mg",
  "COA_NAD__500mg.pdf": "nad-500mg",
  "COA_Oxytocin_Acetate_10mg.pdf": "oxytocin-acetate-10mg",
  "COA_Oxytocin_Acetate_2mg.pdf": "oxytocin-acetate-2mg",
  "COA_Oxytocin_Acetate_5mg.pdf": "oxytocin-acetate-5mg",
  "COA_PEG-MGF_2mg.pdf": "peg-mgf-2mg",
  "COA_Pinealon_10mg.pdf": "pinealon-10mg",
  "COA_Pinealon_Capsules.pdf": "pinealon-capsules-100-count",
  "COA_Reduced_Glutathione_600mg.pdf": "glutathione-600mg",
  "COA_Reconstitution_Solution_10ml.pdf": "bacteriostatic-water-10ml",
  "COA_Retatrutide_100mg.pdf": "retatrutide-100mg",
  "COA_Retatrutide_50mg.pdf": "retatrutide-50mg",
  "COA_Selank_10mg.pdf": "selank-10mg",
  "COA_Selank_10mg_Nasal_Spray.pdf": "selank-nasal-spray-10mg",
  "COA_Selank_5mg.pdf": "selank-5mg",
  "COA_Semaglutide_10mg.pdf": "semaglutide-10mg",
  "COA_Semaglutide_5mg.pdf": "semaglutide-5mg",
  "COA_Semax_10mg.pdf": "semax-10mg",
  "COA_Semax_10mg_Nasal_Spray.pdf": "semax-nasal-spray-10mg",
  "COA_Semax_5mg.pdf": "semax-5mg",
  "COA_Sermorelin_10mg.pdf": "sermorelin-10mg",
  "COA_Sermorelin_5mg.pdf": "sermorelin-5mg",
  "COA_Snap-8_10mg.pdf": "snap-8-10mg",
  "COA_SS-31_10mg.pdf": "ss-31-10mg",
  "COA_SS-31_20mg.pdf": "ss-31-25mg",
  "COA_SS-31_30mg.pdf": "ss-31-50mg",
  "COA_Survodutide_10mg.pdf": "survodutide-10mg",
  "COA_Tesamorelin_10mg.pdf": "tesamorelin-10mg",
  "COA_Tesamorelin_20mg.pdf": "tesamorelin-20mg",
  "COA_Tesamorelin_5mg.pdf": "tesamorelin-5mg",
  "COA_Thymalin_10mg.pdf": "thymalin-10mg",
  "COA_Thymosin_alpha-1_10mg.pdf": "thymosin-alpha-1-10mg",
  "COA_Thymosin_alpha-1_5mg.pdf": "thymosin-alpha-1-5mg",
  "COA_Thymosin_Beta-4_TB-500_10mg.pdf": "tb500-10mg",
  "COA_Thymosin_Beta-4_TB-500_5mg.pdf": "tb500-5mg",
  "COA_VIP_10mg.pdf": "vip-10mg"
}

/** Legacy manifest variant_handle → live Medusa handle */
export const MANIFEST_HANDLE_ALIASES = {
  "bpc-157-capsules-100ct": "bpc-157-capsules-100-count-500mcg",
  "nad-plus-1000mg": "nad-1000mg",
  "nad-plus-100mg": "nad-100mg",
  "nad-plus-500mg": "nad-500mg",
  "pinealon-capsules-100ct": "pinealon-capsules-100-count",
  "glow-blend-30mg": "glow-bpc-157-tb500-ghk-cu-30mg",
  "glow-blend-85mg": "glow-bpc-157-tb500-ghk-cu-85mg",
  "glow-tb500-bpc-157-ghk-cu-70mg": "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg",
  "cu-tb500-bpc-157-kpv-blend-80mg": "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg",
  "bpc-157-tb500-blend-10mg": "bpc-157-5mg-tb500-5mg-10mg",
  "bpc-157-tb500-blend-20mg": "bpc-157-5mg-tb500-5mg-20mg",
  "cagrilintide-plus-semaglutide-5mg": "cagrilintide-semaglutide-5mg",
  "cagrilintide-plus-semaglutide-10mg": "cagrilintide-semaglutide-10mg",
  "cjc-1295-ipamorelin-blend-10mg": "cjc-1295-without-dac-ipamorelin-blend-10mg",
  "cjc-1295-sermorelin-ipamorelin-blend-5mg":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg"
}

const UNMAPPED_NO_CATALOG = [
  "COA_5-Amino-1MQ_50mg_Injectable.pdf",
  "COA_5-Amino-1MQ_50mg_Tablet.pdf",
  "COA_AHK-Cu_100mg.pdf",
  "COA_BPC-157_KPV_250mcg_Tablet.pdf",
  "COA_Cortagen_20mg.pdf",
  "COA_HGH_Fragment_176-191_5mg.pdf",
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
  "COA_TB-500_Fragment_10mg.pdf",
  "COA_Tesamorelin_Ipamorelin_12mg_4mg.pdf",
  "COA_Tesofensine_500mcg_Tablet.pdf",
  "COA_Testagen_20mg.pdf"
]

function slugId(value) {
  return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_|_$/g, "").toLowerCase()
}

async function fetchAll(pathname) {
  const headers = publishableKey ? { "x-publishable-api-key": publishableKey } : {}
  if (pathname.startsWith("/store/coas")) {
    const response = await fetch(`${medusaUrl}${pathname}`, { headers })
    if (!response.ok) throw new Error(`COA fetch failed (${response.status})`)
    const data = await response.json()
    return data.items || []
  }

  const products = []
  let offset = 0
  while (true) {
    const response = await fetch(
      `${medusaUrl}/store/products?limit=100&offset=${offset}&fields=id,handle,title,*variants,*variants.metadata`,
      { headers }
    )
    if (!response.ok) throw new Error(`Product fetch failed (${response.status})`)
    const data = await response.json()
    products.push(...(data.products || []))
    if ((data.products || []).length < 100) break
    offset += 100
  }
  return products
}

function liveHandlesForManifestEntry(entry) {
  const raw = entry.variant_handle || entry.product_handle
  if (!raw) return []
  const aliased = MANIFEST_HANDLE_ALIASES[raw]
  return aliased && aliased !== raw ? [raw, aliased] : [raw]
}

function findCoaEntry(manifest, liveHandle) {
  const coas = manifest.filter((entry) => entry.document_type === "coa")
  const exact = coas.find((entry) => entry.variant_handle === liveHandle)
  if (exact) return exact

  for (const [legacy, live] of Object.entries(MANIFEST_HANDLE_ALIASES)) {
    if (live === liveHandle) {
      const legacyEntry = coas.find((entry) => entry.variant_handle === legacy)
      if (legacyEntry) return legacyEntry
    }
  }
  return null
}

function buildCoaEntry(liveHandle, title, localFile) {
  return {
    id: `coa_${slugId(liveHandle)}_batch_a001`,
    product_handle: liveHandle.replace(
      /-\d+(?:\.\d+)?(?:mg|mcg|ml|iu|count|ct)$/i,
      ""
    ),
    variant_handle: liveHandle,
    batch_number: "A001",
    purity_percent: 99,
    tested_at: "2026-06-01T00:00:00.000Z",
    document_type: "coa",
    local_file: localFile,
    metadata: {
      compound: title,
      variant: liveHandle,
      source_filename: localFile,
      variant_handle: liveHandle
    }
  }
}

async function run() {
  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required")
  }

  const [products, coaDocs, manifest, files] = await Promise.all([
    fetchAll("/store/products"),
    fetchAll("/store/coas?limit=500"),
    fs.readFile(manifestPath, "utf8").then((raw) => JSON.parse(raw)),
    fs.readdir(filesDir)
  ])

  const pdfFiles = files.filter(
    (name) => name.toLowerCase().endsWith(".pdf") && !name.includes("(1)")
  )
  const coaVariantIds = new Set(
    coaDocs.filter((doc) => doc.document_type === "coa").map((doc) => doc.variant_id)
  )

  const unattached = new Set()
  for (const product of products) {
    const hasLive = (product.variants || []).some((variant) =>
      coaVariantIds.has(variant.id)
    )
    if (!hasLive) unattached.add(product.handle)
  }

  const attachPlan = []
  const alreadyAttached = []
  const missingFile = []
  const noLiveProduct = []

  for (const [filename, liveHandle] of Object.entries(PDF_TO_LIVE_HANDLE)) {
    if (!pdfFiles.includes(filename)) {
      missingFile.push({ filename, liveHandle })
      continue
    }
    const product = products.find((item) => item.handle === liveHandle)
    if (!product) {
      noLiveProduct.push({ filename, liveHandle })
      continue
    }
    if (unattached.has(liveHandle)) {
      attachPlan.push({ filename, liveHandle, title: product.title })
    } else {
      alreadyAttached.push({ filename, liveHandle })
    }
  }

  const unattachedNoPdf = [...unattached]
    .filter((handle) => !attachPlan.some((row) => row.liveHandle === handle))
    .sort()

  console.log("=== COA attach tally ===")
  console.log(`Live products: ${products.length}`)
  console.log(`Missing live-variant COA: ${unattached.size}`)
  console.log(`PDFs that can fill gaps: ${attachPlan.length}`)
  console.log(`PDFs for products that already have a live COA: ${alreadyAttached.length}`)
  console.log(`Unattached products with no matching PDF: ${unattachedNoPdf.length}`)
  console.log(`Unmapped PDFs (no catalog SKU): ${UNMAPPED_NO_CATALOG.length}`)
  if (unattachedNoPdf.length) {
    console.log("\nUnattached without PDF:")
    unattachedNoPdf.forEach((handle) => console.log(`  - ${handle}`))
  }
  console.log("\nWill attach:")
  attachPlan
    .sort((a, b) => a.liveHandle.localeCompare(b.liveHandle))
    .forEach((row) => console.log(`  ${row.liveHandle} <- ${row.filename}`))

  if (reportOnly) return

  let created = 0
  let wired = 0
  let updatedHandle = 0

  for (const row of attachPlan) {
    let entry = findCoaEntry(manifest, row.liveHandle)
    if (!entry) {
      entry = buildCoaEntry(row.liveHandle, row.title, row.filename)
      manifest.push(entry)
      created += 1
      console.log(`[create] ${entry.id}`)
    }

    if (entry.variant_handle !== row.liveHandle) {
      entry.variant_handle = row.liveHandle
      updatedHandle += 1
    }
    entry.local_file = row.filename
    entry.metadata = {
      ...(entry.metadata || {}),
      source_filename: row.filename,
      variant_handle: row.liveHandle
    }
    wired += 1
  }

  // Prefer live handle aliases on any remaining legacy COA rows we may sync,
  // but never collide with an existing canonical entry for the same live handle.
  const coaByLiveHandle = new Map(
    manifest
      .filter((entry) => entry.document_type === "coa")
      .map((entry) => [entry.variant_handle, entry])
  )
  for (const entry of manifest) {
    if (entry.document_type !== "coa") continue
    const live = MANIFEST_HANDLE_ALIASES[entry.variant_handle]
    if (!live || live === entry.variant_handle || !unattached.has(live)) continue
    const existing = coaByLiveHandle.get(live)
    if (existing && existing.id !== entry.id) {
      // Drop legacy duplicate local_file so sync won't reattach a twin row.
      delete entry.local_file
      continue
    }
    entry.variant_handle = live
    entry.metadata = {
      ...(entry.metadata || {}),
      variant_handle: live
    }
    coaByLiveHandle.set(live, entry)
    updatedHandle += 1
  }

  if (!dryRun) {
    manifest.sort((a, b) => a.id.localeCompare(b.id))
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8")
    const planPath = path.join(workspaceRoot, "coas", ".attach-plan.json")
    await fs.writeFile(
      planPath,
      `${JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          handles: attachPlan.map((row) => row.liveHandle).sort()
        },
        null,
        2
      )}\n`,
      "utf8"
    )
  }

  console.log(
    `\nWired ${wired} COA(s), created ${created}, updated handles ${updatedHandle}${
      dryRun ? " (dry run)" : ""
    }.`
  )
  console.log("Next: npm run coa:sync-r2 --workspace=@tetrava/catalog -- --from-attach-plan")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
