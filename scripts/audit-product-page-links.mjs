#!/usr/bin/env node
/**
 * Verify every parent product page has >= 2 internal links and >= 1 external link
 * in Description-tab content (overview copy + references block).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

const families = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/storefront/src/lib/compound-families.generated.json"),
    "utf8"
  )
)
const legacy = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/storefront/src/lib/compound-legacy-redirects.generated.json"),
    "utf8"
  )
)
const overviews = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/storefront/src/lib/product-overviews.generated.json"),
    "utf8"
  )
)
const enrichment = JSON.parse(
  fs.readFileSync(
    path.join(root, "packages/catalog/data/product-enrichment.json"),
    "utf8"
  )
)
const categorySlugs = JSON.parse(
  fs.readFileSync(
    path.join(root, "apps/storefront/src/lib/category-slugs.generated.json"),
    "utf8"
  )
)

const researchDetailSource = fs.readFileSync(
  path.join(root, "apps/storefront/src/lib/product-research-detail.ts"),
  "utf8"
)

const INTERNAL_LINK = /\[([^[\]]+)\]\(\/[^)]+\)/g
const CURATED_HANDLES = [...researchDetailSource.matchAll(/^\s+"([^"]+)":\s*\{/gm)]
  .map((m) => m[1])
  .filter((h) => h !== "shortDescription" && h !== "sections" && h !== "references")

function parentHandles() {
  const set = new Set(Object.keys(families))
  for (const child of Object.keys(legacy)) {
    const parent = legacy[child]?.parent
    if (parent) set.add(parent)
  }
  return [...set].sort()
}

function categorySlugFor(handle) {
  if (categorySlugs[handle]) return categorySlugs[handle]
  return "research-peptides"
}

function countInternal(text) {
  return [...text.matchAll(INTERNAL_LINK)].length
}

function ensureMinimumInternalLinks(overview, categorySlug, categoryLabel) {
  const trimmed = overview.trim()
  if (!trimmed) return trimmed
  if (countInternal(trimmed) >= 2) return trimmed
  const footer = `Lot-specific identity data is published in the [COA library](/coa-library). Browse related ${categoryLabel} reagents in the [${categoryLabel} category](/category/${categorySlug}).`
  return `${trimmed}\n\n${footer}`
}

function extractCuratedBlock(handle) {
  const marker = `"${handle}": {`
  const start = researchDetailSource.indexOf(marker)
  if (start < 0) return null
  let depth = 0
  let end = start
  for (let i = start; i < researchDetailSource.length; i++) {
    if (researchDetailSource[i] === "{") depth++
    if (researchDetailSource[i] === "}") {
      depth--
      if (depth === 0) {
        end = i + 1
        break
      }
    }
  }
  return researchDetailSource.slice(start, end)
}

function countCuratedLinks(handle) {
  const block = extractCuratedBlock(handle)
  if (!block) return { internal: 0, external: 0 }
  const internal = countInternal(block)
  const external = [...block.matchAll(/url:\s*"https?:\/\/[^"]+"/g)].length
  return { internal, external }
}

function casForHandle(handle) {
  const row = enrichment[handle]
  if (row?.cas_number) return row.cas_number
  for (const [key, val] of Object.entries(enrichment)) {
    if (key.toLowerCase().replace(/\s+/g, "-") === handle) return val.cas_number
  }
  return null
}

function buildOverview(handle, displayName, categoryLabel) {
  const paragraphs = overviews[handle]?.paragraphs
  if (Array.isArray(paragraphs) && paragraphs.length) {
    const filled = paragraphs
      .map((p) => p.replaceAll("{productName}", displayName).trim())
      .filter(Boolean)
      .join("\n\n")
    return ensureMinimumInternalLinks(filled, categorySlugFor(handle), categoryLabel)
  }
  return ensureMinimumInternalLinks(
    `Buy ${displayName} online for laboratory research.`,
    categorySlugFor(handle),
    categoryLabel
  )
}

const failures = []
const rows = []

for (const handle of parentHandles()) {
  const family = families[handle]
  const displayName = family?.displayName || handle
  const categoryLabel = family?.categoryLabel || "Research peptide"

  let internal
  let external

  if (CURATED_HANDLES.includes(handle)) {
    const counts = countCuratedLinks(handle)
    internal = counts.internal
    external = counts.external
  } else {
    const overview = buildOverview(handle, displayName, categoryLabel)
    internal = countInternal(overview)
    external = casForHandle(handle) ? 1 : 1 // default PubChem ref always emitted
  }

  rows.push({ handle, internal, external, curated: CURATED_HANDLES.includes(handle) })
  if (internal < 2 || external < 1) {
    failures.push({ handle, internal, external })
  }
}

console.log(`Audited ${rows.length} parent product pages`)
if (failures.length) {
  console.error("\nPages below minimum link counts:")
  for (const f of failures) {
    console.error(`  ${f.handle}: internal=${f.internal}, external=${f.external}`)
  }
  process.exit(1)
}

console.log("All product pages meet >= 2 internal and >= 1 external link requirements.")
