/**
 * Scrape Biotech Peptides product prices, match vs Tetrava catalog, write Excel.
 *
 * Run: node scripts/compare-biotech-tetrava-prices.mjs
 */
import { chromium } from "playwright"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const outDir = path.join(repoRoot, "doc")
const outJson = path.join(outDir, "biotech-vs-tetrava-price-comparison.json")

function normalizeName(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/tb[\s-]?500/g, "tb500")
    .replace(/bpc[\s-]?157/g, "bpc157")
    .replace(/ghk[\s-]?cu/g, "ghkcu")
    .replace(/cjc[\s-]?1295/g, "cjc1295")
    .replace(/mod(?:ified)?\s*grf\s*1[\s-]?29/g, "cjc1295nodac")
    .replace(/cjc1295\s*\(?\s*no\s*dac\s*\)?/g, "cjc1295nodac")
    .replace(/pt[\s-]?141|bremelanotide/g, "bremelanotide")
    .replace(/melanotan[\s-]?1|mt[\s-]?1/g, "melanotan1")
    .replace(/igf[\s-]?1[\s-]?lr3/g, "igf1lr3")
    .replace(/foxo4[\s-]?dri|proxofim/g, "foxo4dri")
    .replace(/aod[\s-]?9604/g, "aod9604")
    .replace(/mots[\s-]?c/g, "motsc")
    .replace(/ss[\s-]?31/g, "ss31")
    .replace(/ll[\s-]?37/g, "ll37")
    .replace(/[^a-z0-9]+/g, "")
}

function normalizeStrength(s) {
  const m = String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .match(/(\d+(?:\.\d+)?)(mg|mcg|iu|ml)/)
  if (!m) return ""
  return `${m[1]}${m[2]}`
}

function parseDiscountTable(text) {
  // Typical Biotech table:
  // Quantity  5 - 9   10 +
  // Discount  5%      10%
  const discounts = { qty5Pct: 0, qty10Pct: 0 }
  const t = String(text || "")
  if (/Quantity[\s\S]{0,80}?5\s*[-–]\s*9[\s\S]{0,40}?10\s*\+/i.test(t) &&
      /Discount[\s\S]{0,80}?5\s*%[\s\S]{0,40}?10\s*%/i.test(t)) {
    discounts.qty5Pct = 0.05
    discounts.qty10Pct = 0.1
    return discounts
  }
  // fallback common sitewide pattern seen on BPC page
  if (/5\s*[-–]\s*9[\s\S]{0,30}?5\s*%/i.test(t) && /10\s*\+[\s\S]{0,30}?10\s*%/i.test(t)) {
    discounts.qty5Pct = 0.05
    discounts.qty10Pct = 0.1
  }
  return discounts
}

function money(n) {
  if (n == null || Number.isNaN(n)) return null
  return Math.round(n * 100) / 100
}

function biotechTotals(unit, discounts) {
  const u = Number(unit)
  if (!Number.isFinite(u)) return { q1: null, q5: null, q10: null, u1: null, u5: null, u10: null }
  const u1 = u
  const u5 = u * (1 - (discounts.qty5Pct || 0))
  const u10 = u * (1 - (discounts.qty10Pct || 0))
  return {
    q1: money(u1),
    q5: money(u5 * 5),
    q10: money(u10 * 10),
    u1: money(u1),
    u5: money(u5),
    u10: money(u10)
  }
}

function tetravaByKey(catalog) {
  /** @type {Map<string, any>} */
  const map = new Map()
  for (const row of catalog) {
    const nameKey = normalizeName(row.name)
    const strength = normalizeStrength(row.strength)
    const key = `${nameKey}|${strength}`
    const tiers = Object.fromEntries(
      (row.pack_tiers || []).map((t) => [t.qty, t])
    )
    map.set(key, {
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
    })
  }
  return map
}

function findMatch(tetravaMap, biotechName, strength) {
  const nameKey = normalizeName(biotechName)
  const str = normalizeStrength(strength)
  const exact = tetravaMap.get(`${nameKey}|${str}`)
  if (exact) return { match: exact, confidence: "exact" }

  // try alias name keys
  const aliases = [
    nameKey,
    nameKey.replace(/blend$/, ""),
    nameKey.replace(/peptide$/, ""),
    nameKey.replace(/copper$/, ""),
    nameKey.replace(/topical$/, "")
  ]
  for (const a of aliases) {
    const hit = tetravaMap.get(`${a}|${str}`)
    if (hit) return { match: hit, confidence: "alias" }
  }

  // name-only candidates with same strength
  const candidates = []
  for (const [k, v] of tetravaMap) {
    const [nk, sk] = k.split("|")
    if (sk !== str) continue
    if (nk.includes(nameKey) || nameKey.includes(nk)) candidates.push(v)
  }
  if (candidates.length === 1) return { match: candidates[0], confidence: "fuzzy" }
  return { match: null, confidence: "none" }
}

async function collectProductUrls(page) {
  const productUrls = new Set()
  const listingPages = [
    "https://biotechpeptides.com/buy-peptides/",
    "https://biotechpeptides.com/product-category/peptides/",
    "https://biotechpeptides.com/product-category/blends/"
  ]

  async function scrapeListing(url) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 })
    await page.waitForTimeout(800)
    const hrefs = await page.$$eval('a[href*="/product/"]', (as) =>
      as
        .map((a) => a.href.split("?")[0])
        .filter((h) => h.includes("/product/") && !h.includes("/product-category/"))
        .map((h) => (h.endsWith("/") ? h : `${h}/`))
    )
    for (const h of hrefs) {
      const slug = (h.split("/product/")[1] || "").replace(/\/$/, "")
      if (slug && !slug.includes("/")) productUrls.add(h)
    }
    return page.$$eval("a", (as) => {
      let max = 1
      for (const a of as) {
        const m = (a.href || "").match(/\/page\/(\d+)/)
        if (m) max = Math.max(max, Number(m[1]))
      }
      return max
    })
  }

  for (const base of listingPages) {
    const max = await scrapeListing(base)
    for (let p = 2; p <= Math.min(max, 40); p++) {
      await scrapeListing(`${base}${base.endsWith("/") ? "" : "/"}page/${p}/`)
    }
  }
  return [...productUrls].sort()
}

async function scrapeProduct(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 })
  await page.waitForTimeout(700)
  return page.evaluate((pageUrl) => {
    const title = document.querySelector("h1")?.textContent?.trim() || ""
    const form = document.querySelector("form.variations_form")
    let variations = []
    if (form) {
      try {
        variations = JSON.parse(form.getAttribute("data-product_variations") || "[]")
      } catch {
        variations = []
      }
    }

    const bodyText = document.body.innerText || ""

    // Simple product (no variations)
    let simplePrice = null
    if (!variations.length) {
      const amount = document.querySelector(".summary .price .woocommerce-Price-amount, p.price .woocommerce-Price-amount")
      const t = amount?.textContent || ""
      const m = t.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/)
      if (m) simplePrice = Number(m[1])
    }

    const items = []
    if (variations.length) {
      for (const v of variations) {
        const attrs = v.attributes || {}
        const size =
          attrs.attribute_pa_size ||
          attrs.attribute_size ||
          Object.values(attrs)[0] ||
          ""
        const strengthLabel = String(size).replace(/-/g, "")
        items.push({
          strengthRaw: size,
          strength: strengthLabel,
          unitPrice: Number(v.display_price),
          sku: v.sku || "",
          inStock: !!v.is_in_stock
        })
      }
    } else if (simplePrice != null) {
      // strength from title e.g. (5mg)
      const m = title.match(/\(([^)]*?\d+\s*(?:mg|mcg|iu)[^)]*)\)/i)
      const strength = m ? m[1].split(/[&,]/)[0].trim() : ""
      items.push({
        strengthRaw: strength,
        strength,
        unitPrice: simplePrice,
        sku: "",
        inStock: true
      })
    }

    return { url: pageUrl, title, items, bodyText: bodyText.slice(0, 6000) }
  }, url)
}

async function main() {
  const catalog = JSON.parse(
    readFileSync(path.join(repoRoot, "product_catalog_usd.json"), "utf8")
  )
  const tetravaMap = tetravaByKey(catalog)

  console.log(`Tetrava SKUs: ${catalog.length}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const urls = await collectProductUrls(page)
  console.log(`Biotech product URLs: ${urls.length}`)

  const biotechRows = []
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    process.stdout.write(`  [${i + 1}/${urls.length}] ${url}\n`)
    try {
      const scraped = await scrapeProduct(page, url)
      const discounts = parseDiscountTable(scraped.bodyText)
      // default site pattern if empty but product page looks like standard shop
      if (!discounts.qty5Pct && !discounts.qty10Pct) {
        discounts.qty5Pct = 0.05
        discounts.qty10Pct = 0.1
      }
      for (const item of scraped.items) {
        const totals = biotechTotals(item.unitPrice, discounts)
        const strength = normalizeStrength(item.strength) || normalizeStrength(scraped.title)
        // Clean display name: strip strength parentheses for matching
        const displayName = scraped.title.replace(/\([^)]*\)/g, "").replace(/Sale!/gi, "").trim()
        const { match, confidence } = findMatch(tetravaMap, displayName, strength)

        biotechRows.push({
          biotechTitle: scraped.title,
          biotechName: displayName,
          biotechUrl: scraped.url,
          biotechStrength: strength || item.strength,
          biotechSku: item.sku,
          biotechUnitList: item.unitPrice,
          biotechDiscount5Pct: discounts.qty5Pct,
          biotechDiscount10Pct: discounts.qty10Pct,
          biotech_q1: totals.q1,
          biotech_q5: totals.q5,
          biotech_q10: totals.q10,
          biotech_u1: totals.u1,
          biotech_u5: totals.u5,
          biotech_u10: totals.u10,
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
          diff_q1: match?.q1 != null && totals.q1 != null ? money(match.q1 - totals.q1) : null,
          diff_q5: match?.q5 != null && totals.q5 != null ? money(match.q5 - totals.q5) : null,
          diff_q10: match?.q10 != null && totals.q10 != null ? money(match.q10 - totals.q10) : null,
          cheaperAt1:
            match?.q1 != null && totals.q1 != null
              ? match.q1 < totals.q1
                ? "Tetrava"
                : match.q1 > totals.q1
                  ? "Biotech"
                  : "Tie"
              : "",
          cheaperAt5:
            match?.q5 != null && totals.q5 != null
              ? match.q5 < totals.q5
                ? "Tetrava"
                : match.q5 > totals.q5
                  ? "Biotech"
                  : "Tie"
              : "",
          cheaperAt10:
            match?.q10 != null && totals.q10 != null
              ? match.q10 < totals.q10
                ? "Tetrava"
                : match.q10 > totals.q10
                  ? "Biotech"
                  : "Tie"
              : ""
        })
      }
    } catch (err) {
      console.warn(`  FAIL ${url}: ${err.message}`)
      biotechRows.push({
        biotechTitle: "",
        biotechName: "",
        biotechUrl: url,
        biotechStrength: "",
        error: err.message,
        matchConfidence: "error"
      })
    }
  }

  await browser.close()

  // Unmatched Tetrava products (for coverage sheet)
  const matchedSlugs = new Set(biotechRows.map((r) => r.tetravaSlug).filter(Boolean))
  const unmatchedTetrava = catalog
    .filter((r) => !matchedSlugs.has(r.slug))
    .map((r) => ({
      name: r.name,
      strength: r.strength,
      slug: r.slug,
      category: r.storefront_category || r.category,
      q1: r.pack_tiers?.find((t) => t.qty === 1)?.price_usd ?? r.price_usd,
      q5: r.pack_tiers?.find((t) => t.qty === 5)?.price_usd ?? null,
      q10: r.pack_tiers?.find((t) => t.qty === 10)?.price_usd ?? null
    }))

  const matched = biotechRows.filter((r) => r.matchConfidence && r.matchConfidence !== "none" && r.matchConfidence !== "error")
  const unmatchedBiotech = biotechRows.filter((r) => r.matchConfidence === "none")

  const payload = {
    scrapedAt: new Date().toISOString(),
    notes: [
      "Biotech qty 5/10 totals = discounted unit price × qty.",
      "Biotech site shows volume discounts typically 5% for qty 5–9 and 10% for qty 10+.",
      "Tetrava qty 1/5/10 are pack-tier totals from product_catalog_usd.json.",
      "diff_* = Tetrava − Biotech (negative means Tetrava cheaper)."
    ],
    counts: {
      biotechProductPages: urls.length,
      biotechSkuRows: biotechRows.length,
      matched: matched.length,
      unmatchedBiotech: unmatchedBiotech.length,
      unmatchedTetrava: unmatchedTetrava.length
    },
    rows: biotechRows,
    unmatchedTetrava
  }

  mkdirSync(outDir, { recursive: true })
  writeFileSync(outJson, JSON.stringify(payload, null, 2))
  console.log(JSON.stringify(payload.counts, null, 2))
  console.log(`Wrote scrape JSON ${outJson}`)

  // Rematch (explicit blend/DAC rules) + Excel with $/vial + pack totals
  const { execSync } = await import("node:child_process")
  execSync("node scripts/rematch-biotech-tetrava-excel.mjs", {
    cwd: repoRoot,
    stdio: "inherit"
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
