/**
 * Map Medusa product handles → /products/v2/* image files.
 *
 * Writes: src/lib/product-image-map.generated.json
 * Report: scripts/image-map-report.json (unmapped + summary)
 *
 * Usage (from repo root):
 *   npm run map:images
 *   npm run map:images -- --dry-run
 *
 * Env (apps/medusa/.env and/or apps/storefront/.env.local):
 *   NEXT_PUBLIC_MEDUSA_URL / MEDUSA_ADMIN_URL
 *   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY / MEDUSA_PUBLISHABLE_KEY
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storefrontRoot = path.resolve(__dirname, "..")
const workspaceRoot = path.resolve(storefrontRoot, "..", "..")

dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })
dotenv.config({ path: path.join(storefrontRoot, ".env.local") })

const dryRun = process.argv.includes("--dry-run")
const V2_BASE = "/products/v2"
const imagesDir = path.join(storefrontRoot, "public", "products", "v2")
const outputPath = path.join(storefrontRoot, "src", "lib", "product-image-map.generated.json")
const customMappingsPath = path.join(__dirname, "product-image-custom-mappings.json")
const catalogHandlesPath = path.join(storefrontRoot, "src", "lib", "catalog-handles.generated.json")
const reportPath = path.join(__dirname, "image-map-report.json")

const MEDUSA_URL = (
  process.env.NEXT_PUBLIC_MEDUSA_URL ||
  process.env.MEDUSA_ADMIN_URL ||
  ""
).replace(/\/$/, "")
const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ||
  process.env.MEDUSA_PUBLISHABLE_KEY ||
  ""

/** Catalog map always prefers labeled SVG; PNGs are featured-row only (product-image-map.ts). */
const PREFER_PNG_HANDLES = new Set([])

const AUTO_MATCH_PATTERNS = [
  [/bpc.?157.*5mg/i, `${V2_BASE}/bpc-157-5mg.svg`],
  [/bpc.?157.*10mg/i, `${V2_BASE}/bpc-157-10mg.svg`],
  [/bpc.?157.*capsule/i, `${V2_BASE}/bpc-157-capsules.svg`],
  [/tb500.*5mg/i, `${V2_BASE}/tb500-5mg.svg`],
  [/tb500.*10mg/i, `${V2_BASE}/tb500-10mg.svg`],
  [/ghk.?cu.*50/i, `${V2_BASE}/ghk-cu-50mg.svg`],
  [/ghk.?cu.*100/i, `${V2_BASE}/ghk-cu-100mg.svg`],
  [/cjc.*without.*dac.*5/i, `${V2_BASE}/cjc-1295-no-dac-5mg.svg`],
  [/cjc.*without.*dac.*10/i, `${V2_BASE}/cjc-1295-no-dac-10mg.svg`],
  [/cjc.*with.*dac.*5/i, `${V2_BASE}/cjc-1295-5mg.svg`],
  [/cjc.*with.*dac.*10/i, `${V2_BASE}/cjc-1295-10mg.svg`],
  [/ipamorelin.*5mg/i, `${V2_BASE}/ipamorelin-5mg.svg`],
  [/semaglutide.*5mg/i, `${V2_BASE}/semaglutide-5mg.svg`],
  [/tirzepatide.*10mg/i, `${V2_BASE}/tirzepatide-10mg.svg`],
  [/retatrutide.*5mg/i, `${V2_BASE}/retatrutide-5mg.svg`],
  [/hgh.*10.?iu/i, `${V2_BASE}/hgh-191aa-10iu.svg`],
  [/hgh.*12.?iu/i, `${V2_BASE}/hgh-191aa-12iu.svg`],
  [/hgh.*15.?iu/i, `${V2_BASE}/hgh-191aa-15iu.svg`],
  [/hgh.*24.?iu/i, `${V2_BASE}/hgh-191aa-24iu.svg`],
  [/hgh.*36.?iu/i, `${V2_BASE}/hgh-191aa-36iu.svg`],
  [/nad.*100/i, `${V2_BASE}/nad-100mg.svg`],
  [/nad.*500/i, `${V2_BASE}/nad-500mg.svg`],
  [/nad.*1000/i, `${V2_BASE}/nad-1000mg.svg`],
  [/bacteriostatic.*10/i, `${V2_BASE}/bacteriostatic-water-10ml.svg`],
  [/acetic.*acid/i, `${V2_BASE}/acetic-acid-3ml.svg`],
  [/benzyl.*alcohol/i, `${V2_BASE}/acetic-acid-3ml.svg`],
  [/glow.*30/i, `${V2_BASE}/glow-blend-30mg.svg`],
  [/glow.*85/i, `${V2_BASE}/glow-blend-85mg.svg`],
  [/glow.*70/i, `${V2_BASE}/glow-enhanced-70mg.svg`],
  [/bpc.*tb500.*20/i, `${V2_BASE}/bpc-tb500-blend-20mg.svg`],
  [/bpc.*tb500.*10/i, `${V2_BASE}/bpc-tb500-blend-10mg.svg`],
  [/copper.*80|cu-50.*80/i, `${V2_BASE}/copper-repair-80mg.svg`],
  [/cagrilintide.*semaglutide/i, `${V2_BASE}/semaglutide-5mg.svg`],
  [/kisspeptin.*10.*10/i, `${V2_BASE}/kisspeptin-10mg.svg`],
  [/kisspeptin.*5/i, `${V2_BASE}/kisspeptin-5mg.svg`]
]

async function loadJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"))
  } catch {
    return fallback
  }
}

async function fetchMedusaProducts() {
  if (!MEDUSA_URL || !PUBLISHABLE_KEY) {
    throw new Error(
      "Set NEXT_PUBLIC_MEDUSA_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (or MEDUSA_* equivalents)."
    )
  }

  const all = []
  let offset = 0
  const limit = 100

  while (true) {
    const url = new URL(`${MEDUSA_URL}/store/products`)
    url.searchParams.set("limit", String(limit))
    url.searchParams.set("offset", String(offset))
    url.searchParams.set("fields", "id,handle,title,metadata")

    const response = await fetch(url, {
      headers: { "x-publishable-api-key": PUBLISHABLE_KEY }
    })

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const batch = data.products || []
    all.push(...batch)
    if (batch.length < limit) break
    offset += limit
  }

  return all
}

function buildFileIndex(files) {
  const byStem = new Map()
  for (const file of files) {
    const stem = file.replace(/\.(svg|png)$/i, "")
    const list = byStem.get(stem) || []
    list.push(file)
    byStem.set(stem, list)
  }
  return byStem
}

function pickFile(stem, byStem, handle) {
  const matches = byStem.get(stem)
  if (!matches?.length) return null

  if (PREFER_PNG_HANDLES.has(handle)) {
    const png = matches.find((file) => file.endsWith(".png"))
    if (png) return png
  }

  const svg = matches.find((file) => file.endsWith(".svg"))
  if (svg) return svg

  // Catalog uses SVG only — try alternate stems instead of falling back to PNG.
  return null
}

function normalizeHandleToStem(handle) {
  return handle
    .replace(/^ghrp-2-acetate-/i, "ghrp-2-")
    .replace(/^ghrp-6-acetate-/i, "ghrp-6-")
    .replace(/^hexarelin-acetate-/i, "hexarelin-")
    .replace(/^oxytocin-acetate-/i, "oxytocin-")
    .replace(/^hcg-(\d+)-iu$/i, "hcg-$1iu")
    .replace(/^hmg-(\d+)-iu$/i, "hmg-$1iu")
    .replace(/^igf-1-lr3-0-1mg$/i, "igf-1-lr3-0.1mg")
    .replace(/^kisspeptin-10-/i, "kisspeptin-")
    .replace(/^melanotan-1-/i, "melanotan-i-")
    .replace(/^melanotan-2-/i, "melanotan-ii-")
    .replace(/^l-carnitine-600mg-10ml$/i, "l-carnitine-600mg")
    .replace(/^pinealon-capsules-100-count$/i, "pinealon-capsules")
}

function candidateStems(handle) {
  const stems = new Set([handle, normalizeHandleToStem(handle)])
  stems.add(handle.replace(/-plus-/g, "-"))
  stems.add(handle.replace(/191aa-(\d+)-iu/gi, "191aa-$1iu"))
  stems.add(handle.replace(/^hgh-191aa-10-iu$/i, "hgh-10iu"))
  stems.add(handle.replace(/^hgh-191aa-12-iu$/i, "hgh-191aa-12iu"))
  stems.add(handle.replace(/^hgh-191aa-15-iu$/i, "hgh-191aa-15iu"))
  stems.add(handle.replace(/^hgh-191aa-24-iu$/i, "hgh-191aa-24iu"))
  stems.add(handle.replace(/^hgh-191aa-36-iu$/i, "hgh-191aa-36iu"))
  stems.add(handle.replace(/cjc-1295-with-dac/i, "cjc-1295"))
  stems.add(handle.replace(/cjc-1295-without-dac/i, "cjc-1295-no-dac"))
  stems.add(handle.replace(/bpc-157/g, "bpc157"))
  stems.add(handle.replace(/cjc-1295-with-dac/g, "cjc1295"))
  return [...stems]
}

function resolveImage(handle, byStem, customMappings, availableSet) {
  if (customMappings[handle]) {
    const mapped = customMappings[handle]
    const basename = path.basename(mapped)
    if (availableSet.has(basename)) return mapped
  }

  for (const stem of candidateStems(handle)) {
    const file = pickFile(stem, byStem, handle)
    if (file) return `${V2_BASE}/${file}`
  }

  for (const [pattern, imagePath] of AUTO_MATCH_PATTERNS) {
    if (pattern.test(handle)) {
      const basename = path.basename(imagePath)
      if (availableSet.has(basename)) return imagePath
    }
  }

  return null
}

async function run() {
  const [files, customMappings, catalogHandles] = await Promise.all([
    fs.readdir(imagesDir),
    loadJson(customMappingsPath, {}),
    loadJson(catalogHandlesPath, null)
  ])

  const imageFiles = files.filter((file) => /\.(svg|png)$/i.test(file)).sort()
  const availableSet = new Set(imageFiles)
  const byStem = buildFileIndex(imageFiles)

  console.log(`Images in ${imagesDir}: ${imageFiles.length}`)
  console.log(`Custom mappings: ${Object.keys(customMappings).length}`)

  const products = await fetchMedusaProducts()
  console.log(`Medusa products fetched: ${products.length}`)

  const catalogSet = catalogHandles ? new Set(catalogHandles) : null
  const targetProducts = catalogSet
    ? products.filter((product) => catalogSet.has(product.handle))
    : products

  if (catalogSet) {
    console.log(`Catalog-filtered products: ${targetProducts.length}`)
  }

  const imageMap = {}
  const mapped = []
  const unmapped = []

  for (const product of targetProducts) {
    const image = resolveImage(product.handle, byStem, customMappings, availableSet)
    if (image) {
      imageMap[product.handle] = image
      mapped.push({ handle: product.handle, title: product.title, image })
    } else {
      unmapped.push({ handle: product.handle, title: product.title })
    }
  }

  const sortedMap = Object.fromEntries(
    Object.entries(imageMap).sort(([a], [b]) => a.localeCompare(b))
  )

  const report = {
    generated_at: new Date().toISOString(),
    medusa_url: MEDUSA_URL,
    total_products: targetProducts.length,
    mapped: mapped.length,
    unmapped: unmapped.length,
    unmapped_products: unmapped
  }

  console.log(`\nMapped: ${mapped.length} / ${targetProducts.length}`)
  if (unmapped.length) {
    console.log("\nUnmapped products:")
    for (const item of unmapped) {
      console.log(`  - ${item.handle} (${item.title})`)
    }
  }

  if (dryRun) {
    console.log("\n[dry-run] No files written.")
    return
  }

  await fs.writeFile(outputPath, `${JSON.stringify(sortedMap, null, 2)}\n`, "utf8")
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8")
  console.log(`\nWrote ${outputPath}`)
  console.log(`Wrote ${reportPath}`)
}

run().catch((error) => {
  console.error("Image mapping failed:", error?.message || error)
  process.exit(1)
})
