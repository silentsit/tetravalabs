/**
 * Rematch Biotech scrape JSON → Tetrava and write Excel.
 * Run: node scripts/rematch-biotech-tetrava-excel.mjs
 */
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRequire } from "node:module"

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), "../package.json"))
const XLSX = require("xlsx")

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const jsonPath = path.join(repoRoot, "doc/biotech-vs-tetrava-price-comparison.json")
const outXlsx = path.join(repoRoot, "doc/biotech-vs-tetrava-price-comparison.xlsx")
const catalog = JSON.parse(readFileSync(path.join(repoRoot, "product_catalog_usd.json"), "utf8"))
const payload = JSON.parse(readFileSync(jsonPath, "utf8"))

function money(n) {
  if (n == null || Number.isNaN(Number(n))) return null
  return Math.round(Number(n) * 100) / 100
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/tb[\s-]?500|thymosin\s*beta[\s-]?4/g, "tb500")
    .replace(/bpc[\s-]?157/g, "bpc157")
    .replace(/ghk[\s-]?cu|copper/g, "ghkcu")
    .replace(/cjc[\s-]?1295\s*(with\s*)?dac/g, "cjc1295dac")
    .replace(/cjc[\s-]?1295\s*(without\s*dac|no\s*dac)|mod(?:ified)?\s*grf\s*1[\s-]?29/g, "cjc1295nodac")
    .replace(/cjc[\s-]?1295/g, "cjc1295")
    .replace(/pt[\s-]?141|bremelanotide/g, "bremelanotide")
    .replace(/melanotan[\s-]?1|mt[\s-]?1/g, "melanotan1")
    .replace(/igf[\s-]?1[\s-]?lr3|receptor\s*grade/g, "igf1lr3")
    .replace(/foxo4[\s-]?dri|proxofim/g, "foxo4dri")
    .replace(/aod[\s-]?9604/g, "aod9604")
    .replace(/acetate/g, "")
    .replace(/peptide|blend|sale!/g, "")
    .replace(/[^a-z0-9]+/g, "")
}

function strength(s) {
  const m = String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .match(/(\d+(?:\.\d+)?)(mg|mcg|iu|ml)/)
  return m ? `${m[1]}${m[2]}` : ""
}

function isBlend(name) {
  const s = String(name || "")
  // Ignore strength pairs like "(5mg & 10mg)" — those are variants, not blends
  const withoutStrengthPairs = s.replace(
    /\(\s*\d+(?:\.\d+)?\s*(?:mg|mcg|iu|ml)\s*[&,\/]\s*\d+(?:\.\d+)?\s*(?:mg|mcg|iu|ml)\s*\)/gi,
    ""
  )
  return /blend|\+| and |&|\/|klow|glow|wolverine/i.test(withoutStrengthPairs)
}

/** Explicit Biotech title/url → Tetrava slug overrides */
const EXPLICIT = [
  {
    test: (r) => /bpc-157-tb-500-10mg-blend/i.test(r.biotechUrl) || (/bpc157/.test(norm(r.biotechTitle)) && /tb500/.test(norm(r.biotechTitle)) && !/ghk/.test(norm(r.biotechTitle)) && strength(r.biotechStrength) === "10mg"),
    slug: (catalog) => catalog.find((c) => /bpc-157.*tb.?500.*10mg|bpc.*tb.*blend.*10/i.test(c.slug + c.name + c.strength))?.slug
  },
  {
    test: (r) =>
      /bpc-157-tb-500-ghk-cu-blend-70mg/i.test(r.biotechUrl) ||
      (/70mg/i.test(r.biotechStrength + r.biotechTitle) &&
        /bpc/i.test(r.biotechTitle) &&
        /tb.?500|tb500/i.test(r.biotechTitle) &&
        /ghk/i.test(r.biotechTitle)),
    slug: () =>
      catalog.find((c) => /70mg/i.test(c.strength + c.name) && /glow|ghk/i.test(c.name) && /bpc/i.test(c.name))
        ?.slug
  },
  {
    test: (r) => /klow/i.test(r.biotechUrl + r.biotechTitle) || (/80mg/i.test(r.biotechStrength) && /kpv|klow/i.test(r.biotechTitle)),
    slug: () => catalog.find((c) => /80mg|kpv/i.test(c.name + c.strength) && /bpc/i.test(c.name))?.slug
  },
  {
    test: (r) => /cjc-1295-dac/i.test(r.biotechUrl) || (/cjc1295dac/.test(norm(r.biotechTitle)) && !/ipamorelin|ghrp/i.test(r.biotechTitle)),
    slug: (c, r) => catalog.find((x) => /with dac/i.test(x.name) && strength(x.strength) === strength(r.biotechStrength))?.slug
  },
  {
    test: (r) => /mod-grf-1-29-5mg-cjc-1295-no-dac|no dac/i.test(r.biotechUrl + r.biotechTitle) && !/ipamorelin|ghrp|blend/i.test(r.biotechTitle),
    slug: (c, r) =>
      catalog.find((x) => /without dac/i.test(x.name) && !/ipamorelin|sermorelin/i.test(x.name) && strength(x.strength) === strength(r.biotechStrength))
        ?.slug
  },
  {
    test: (r) => /cjc-1295-ipamorelin-10mg-blend/i.test(r.biotechUrl) || (/cjc/.test(norm(r.biotechTitle)) && /ipamorelin/.test(norm(r.biotechTitle)) && !/ghrp|sermorelin|fragment/i.test(r.biotechTitle) && strength(r.biotechStrength) === "10mg"),
    slug: () =>
      catalog.find((x) => /without dac.*ipamorelin|ipamorelin blend/i.test(x.name) && /10mg/i.test(x.strength) && !/sermorelin|ghrp/i.test(x.name))
        ?.slug
  },
  {
    test: (r) => /mod-grf-1-29-ipamorelin-10mg-blend/i.test(r.biotechUrl),
    slug: () =>
      catalog.find((x) => /without dac.*ipamorelin/i.test(x.name) && /10mg/i.test(x.strength) && !/sermorelin/i.test(x.name))
        ?.slug
  }
]

function tetravaEntry(slugOrRow) {
  const row = typeof slugOrRow === "string" ? catalog.find((c) => c.slug === slugOrRow) : slugOrRow
  if (!row) return null
  const tiers = Object.fromEntries((row.pack_tiers || []).map((t) => [t.qty, t]))
  return {
    name: row.name,
    strength: row.strength,
    slug: row.slug,
    category: row.storefront_category || row.category,
    q1: tiers[1]?.price_usd ?? row.price_usd ?? null,
    q5: tiers[5]?.price_usd ?? null,
    q10: tiers[10]?.price_usd ?? null,
    u1: tiers[1]?.per_unit_usd ?? row.price_usd ?? null,
    u5: tiers[5]?.per_unit_usd ?? null,
    u10: tiers[10]?.per_unit_usd ?? null
  }
}

const byKey = new Map()
for (const row of catalog) {
  byKey.set(`${norm(row.name)}|${strength(row.strength)}`, row)
}

function matchRow(r) {
  for (const rule of EXPLICIT) {
    if (rule.test(r)) {
      const slug = rule.slug(catalog, r)
      if (slug) return { match: tetravaEntry(slug), confidence: "explicit" }
    }
  }

  const nameKey = norm(r.biotechName || r.biotechTitle)
  const str = strength(r.biotechStrength)
  const exact = byKey.get(`${nameKey}|${str}`)
  if (exact) return { match: tetravaEntry(exact), confidence: "exact" }

  // single-compound only fuzzy (never map blends onto singles)
  if (isBlend(r.biotechTitle) || isBlend(r.biotechName)) {
    return { match: null, confidence: "none" }
  }

  const candidates = []
  for (const [k, row] of byKey) {
    const [nk, sk] = k.split("|")
    if (sk !== str) continue
    if (isBlend(row.name)) continue
    if (nk === nameKey || nk.includes(nameKey) || nameKey.includes(nk)) candidates.push(row)
  }
  // Prefer longer name overlap / acetate-stripped equality
  const filtered = candidates.filter((c) => {
    const cn = norm(c.name)
    return cn === nameKey || cn.startsWith(nameKey) || nameKey.startsWith(cn)
  })
  const pool = filtered.length ? filtered : []
  if (pool.length === 1) return { match: tetravaEntry(pool[0]), confidence: "fuzzy" }
  return { match: null, confidence: "none" }
}

const rematched = payload.rows.map((r) => {
  if (r.error) return r
  const { match, confidence } = matchRow(r)
  const next = {
    ...r,
    matchConfidence: confidence,
    tetravaName: match?.name || "",
    tetravaStrength: match?.strength || "",
    tetravaSlug: match?.slug || "",
    tetravaCategory: match?.category || "",
    tetrava_q1: match?.q1 ?? null,
    tetrava_q5: match?.q5 ?? null,
    tetrava_q10: match?.q10 ?? null,
    tetrava_u1: match?.u1 ?? null,
    tetrava_u5: match?.u5 ?? null,
    tetrava_u10: match?.u10 ?? null,
    diff_q1: match?.q1 != null && r.biotech_q1 != null ? money(match.q1 - r.biotech_q1) : null,
    diff_q5: match?.q5 != null && r.biotech_q5 != null ? money(match.q5 - r.biotech_q5) : null,
    diff_q10: match?.q10 != null && r.biotech_q10 != null ? money(match.q10 - r.biotech_q10) : null,
    cheaperAt1:
      match?.q1 != null && r.biotech_q1 != null
        ? match.q1 < r.biotech_q1
          ? "Tetrava"
          : match.q1 > r.biotech_q1
            ? "Biotech"
            : "Tie"
        : "",
    cheaperAt5:
      match?.q5 != null && r.biotech_q5 != null
        ? match.q5 < r.biotech_q5
          ? "Tetrava"
          : match.q5 > r.biotech_q5
            ? "Biotech"
            : "Tie"
        : "",
    cheaperAt10:
      match?.q10 != null && r.biotech_q10 != null
        ? match.q10 < r.biotech_q10
          ? "Tetrava"
          : match.q10 > r.biotech_q10
            ? "Biotech"
            : "Tie"
        : ""
  }
  return next
})

const matched = rematched.filter((r) => ["exact", "fuzzy", "explicit"].includes(r.matchConfidence))
const unmatchedBiotech = rematched.filter((r) => r.matchConfidence === "none")
const matchedSlugs = new Set(matched.map((r) => r.tetravaSlug).filter(Boolean))
const unmatchedTetrava = catalog
  .filter((c) => !matchedSlugs.has(c.slug))
  .map((c) => {
    const t1 = c.pack_tiers?.find((t) => t.qty === 1)
    const t5 = c.pack_tiers?.find((t) => t.qty === 5)
    const t10 = c.pack_tiers?.find((t) => t.qty === 10)
    return {
      name: c.name,
      strength: c.strength,
      slug: c.slug,
      category: c.storefront_category || c.category,
      "total @1": t1?.price_usd ?? c.price_usd,
      "total @5": t5?.price_usd ?? null,
      "total @10": t10?.price_usd ?? null,
      "$/vial @1": t1?.per_unit_usd ?? c.price_usd,
      "$/vial @5": t5?.per_unit_usd ?? null,
      "$/vial @10": t10?.per_unit_usd ?? null
    }
  })

payload.rows = rematched
payload.unmatchedTetrava = unmatchedTetrava
payload.counts = {
  ...payload.counts,
  matched: matched.length,
  unmatchedBiotech: unmatchedBiotech.length,
  unmatchedTetrava: unmatchedTetrava.length
}
payload.rematchedAt = new Date().toISOString()
writeFileSync(jsonPath, JSON.stringify(payload, null, 2))

const comparisonSheet = rematched.map((r) => ({
  Match: r.matchConfidence || "",
  "Biotech product": r.biotechTitle || r.biotechName || "",
  "Biotech strength": r.biotechStrength || "",
  "Biotech URL": r.biotechUrl || "",
  "Biotech list $/vial": r.biotechUnitList ?? "",
  "Biotech total qty1": r.biotech_q1 ?? "",
  "Biotech total qty5": r.biotech_q5 ?? "",
  "Biotech total qty10": r.biotech_q10 ?? "",
  "Biotech $/vial @1": r.biotech_u1 ?? "",
  "Biotech $/vial @5": r.biotech_u5 ?? "",
  "Biotech $/vial @10": r.biotech_u10 ?? "",
  "Tetrava product": r.tetravaName || "",
  "Tetrava strength": r.tetravaStrength || "",
  "Tetrava slug": r.tetravaSlug || "",
  "Tetrava category": r.tetravaCategory || "",
  "Tetrava total qty1": r.tetrava_q1 ?? "",
  "Tetrava total qty5": r.tetrava_q5 ?? "",
  "Tetrava total qty10": r.tetrava_q10 ?? "",
  "Tetrava $/vial @1": r.tetrava_u1 ?? "",
  "Tetrava $/vial @5": r.tetrava_u5 ?? "",
  "Tetrava $/vial @10": r.tetrava_u10 ?? "",
  "Diff qty1 (T-B)": r.diff_q1 ?? "",
  "Diff qty5 (T-B)": r.diff_q5 ?? "",
  "Diff qty10 (T-B)": r.diff_q10 ?? "",
  "Cheaper @1": r.cheaperAt1 || "",
  "Cheaper @5": r.cheaperAt5 || "",
  "Cheaper @10": r.cheaperAt10 || ""
}))

const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(comparisonSheet), "Price comparison")
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.json_to_sheet(
    matched.map((r) => ({
      Product: `${r.tetravaName} ${r.tetravaStrength}`.trim(),
      Match: r.matchConfidence,
      // Per-vial first — Tetrava pack tiers drop $/vial as qty rises
      "Biotech $/vial @1": r.biotech_u1,
      "Tetrava $/vial @1": r.tetrava_u1,
      "Diff $/vial @1": r.tetrava_u1 != null && r.biotech_u1 != null ? money(r.tetrava_u1 - r.biotech_u1) : null,
      "Biotech $/vial @5": r.biotech_u5,
      "Tetrava $/vial @5": r.tetrava_u5,
      "Diff $/vial @5": r.tetrava_u5 != null && r.biotech_u5 != null ? money(r.tetrava_u5 - r.biotech_u5) : null,
      "Biotech $/vial @10": r.biotech_u10,
      "Tetrava $/vial @10": r.tetrava_u10,
      "Diff $/vial @10": r.tetrava_u10 != null && r.biotech_u10 != null ? money(r.tetrava_u10 - r.biotech_u10) : null,
      // Pack / order totals
      "Biotech total @1": r.biotech_q1,
      "Tetrava total @1": r.tetrava_q1,
      "Diff total @1": r.diff_q1,
      "Biotech total @5": r.biotech_q5,
      "Tetrava total @5": r.tetrava_q5,
      "Diff total @5": r.diff_q5,
      "Biotech total @10": r.biotech_q10,
      "Tetrava total @10": r.tetrava_q10,
      "Diff total @10": r.diff_q10,
      "Cheaper @1": r.cheaperAt1,
      "Cheaper @5": r.cheaperAt5,
      "Cheaper @10": r.cheaperAt10,
      URL: r.biotechUrl
    }))
  ),
  "Matched only"
)
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.json_to_sheet(
    unmatchedBiotech.map((r) => ({
      Biotech: r.biotechTitle,
      Strength: r.biotechStrength,
      "List $/vial": r.biotechUnitList,
      "$/vial @1": r.biotech_u1,
      "$/vial @5": r.biotech_u5,
      "$/vial @10": r.biotech_u10,
      "Total @1": r.biotech_q1,
      "Total @5": r.biotech_q5,
      "Total @10": r.biotech_q10,
      "Disc @5": r.biotechDiscount5Pct,
      "Disc @10": r.biotechDiscount10Pct,
      URL: r.biotechUrl
    }))
  ),
  "Biotech unmatched"
)
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(unmatchedTetrava), "Tetrava unmatched")
XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.aoa_to_sheet([
    ["Field", "Meaning"],
    ["Biotech $/vial", "List unit after volume discount (~5% qty 5–9, ~10% qty 10+)"],
    ["Biotech totals", "Discounted $/vial × qty"],
    ["Tetrava $/vial", "pack_tiers.per_unit_usd — drops as pack size rises (e.g. BPC 10mg: $69 → $55 → $49)"],
    ["Tetrava totals", "pack_tiers.price_usd for 1 / 5 / 10 vial packs (NOT flat unit × qty)"],
    ["Diff (T-B)", "Tetrava − Biotech (negative = Tetrava cheaper)"],
    ["Note", "Rising pack totals with qty is expected; compare $/vial columns to see volume savings"],
    ["Duplicate rows", "CJC-1295 & Ipamorelin and Mod GRF 1-29 & Ipamorelin both map to the same Tetrava blend SKU"],
    ["Scraped at", payload.scrapedAt],
    ["Rematched at", payload.rematchedAt],
    ["Biotech pages", payload.counts.biotechProductPages],
    ["Matched SKUs", matched.length],
    ["Unmatched Biotech", unmatchedBiotech.length],
    ["Unmatched Tetrava", unmatchedTetrava.length]
  ]),
  "Notes"
)
try {
  XLSX.writeFile(wb, outXlsx)
  console.log("Wrote", outXlsx)
} catch (err) {
  if (err && (err.code === "EBUSY" || /EBUSY|locked/i.test(String(err.message)))) {
    const alt = outXlsx.replace(/\.xlsx$/i, "-updated.xlsx")
    XLSX.writeFile(wb, alt)
    console.warn("Original xlsx locked; wrote", alt)
  } else {
    throw err
  }
}

console.log(JSON.stringify(payload.counts, null, 2))
console.log("Matched:")
matched.forEach((r) => console.log(`  ${r.matchConfidence}: ${r.biotechTitle} => ${r.tetravaName} ${r.tetravaStrength}`))
