/**
 * 1. Add Tetrava Labs → / homepage links to Research Hub JSON (fallback)
 * 2. Upsert all KEPT_BLOG_SLUGS into Sanity
 * 3. Publish every researchArticle document
 *
 * Usage: npm run sanity:sync-blog
 * Requires SANITY_PROJECT_ID + SANITY_API_WRITE_TOKEN in apps/storefront/.env.local
 */

import dotenv from "dotenv"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@sanity/client"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, "..")

dotenv.config({ path: path.join(workspaceRoot, "apps", "storefront", ".env.local") })
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })

const KEPT_BLOG_SLUGS = [
  "retatrutide-benefits-beyond-weight-loss",
  "bpc-157-vs-tb-500",
  "ipamorelin-vs-sermorelin",
  "tesamorelin-vs-sermorelin",
  "selank-research-peptide",
  "tudca-research-compound",
  "why-manufacturing-source-and-verification-matter-in-research-peptide-quality",
  "follistatin-315-research-peptide",
  "hexarelin-acetate-research-peptide",
  "where-to-buy-tirzepatide-2026",
  "where-to-buy-semaglutide-2026",
  "where-to-buy-hgh-191aa-2026",
  "where-to-buy-nad-2026",
  "where-to-buy-bpc-157-2026",
  "where-to-buy-ghk-cu-2026",
  "where-to-buy-melanotan-2-2026"
]

const articlesPath = path.join(workspaceRoot, "apps", "storefront", "src", "data", "research-articles.json")

function homeLinkMark(key = "lnk-home") {
  return { _key: key, _type: "link", href: "/" }
}

function span(key, text, marks = []) {
  return { _type: "span", _key: key, text, marks }
}

function findBlock(body, key) {
  if (!Array.isArray(body)) return null
  return body.find((b) => b._key === key) || null
}

function moveHomeLinkToTetravaLabs(block, homeKey = "lnk-home") {
  if (!block?.children) return false
  const homeSpan = block.children.find((c) => c.marks?.includes(homeKey))
  if (!homeSpan || homeSpan.text === "Tetrava Labs") return false
  homeSpan.marks = homeSpan.marks.filter((m) => m !== homeKey)
  const coaIdx = block.children.findIndex((c) => c.text === "COA Library")
  if (coaIdx === -1) return false
  block.markDefs = block.markDefs || []
  if (!block.markDefs.some((m) => m._key === homeKey)) {
    block.markDefs.push(homeLinkMark(homeKey))
  }
  block.children.splice(
    coaIdx + 1,
    0,
    span(`${homeKey}-pre`, " published by ", []),
    span(`${homeKey}-brand`, "Tetrava Labs", [homeKey])
  )
  return true
}

function addHomeLinkAfterCoaLibrary(block, coaLinkKey, homeKey = "lnk-home") {
  if (!block?.children) return false
  if (block.children.some((c) => c.text === "Tetrava Labs")) return false
  block.markDefs = block.markDefs || []
  if (!block.markDefs.some((m) => m._key === homeKey)) {
    block.markDefs.push(homeLinkMark(homeKey))
  }
  const coaIdx = block.children.findIndex(
    (c) => c.marks?.includes(coaLinkKey) && c.text.toLowerCase().includes("coa")
  )
  if (coaIdx === -1) return false
  block.children.splice(
    coaIdx + 1,
    0,
    span(`${homeKey}-pre`, " published by ", []),
    span(`${homeKey}-brand`, "Tetrava Labs", [homeKey])
  )
  return true
}

function addHomeLinkInline(block, anchorText, homeKey = "lnk-home") {
  if (!block?.children) return false
  if (block.children.some((c) => c.text === "Tetrava Labs")) return false
  block.markDefs = block.markDefs || []
  if (!block.markDefs.some((m) => m._key === homeKey)) {
    block.markDefs.push(homeLinkMark(homeKey))
  }
  const idx = block.children.findIndex((c) => c.text.includes(anchorText))
  if (idx === -1) return false
  const child = block.children[idx]
  const parts = child.text.split(anchorText)
  if (parts.length !== 2) return false
  const newChildren = []
  if (parts[0]) newChildren.push(span(`${homeKey}-a`, parts[0], child.marks || []))
  newChildren.push(span(`${homeKey}-brand`, "Tetrava Labs", [homeKey]))
  if (parts[1]) newChildren.push(span(`${homeKey}-b`, parts[1], child.marks || []))
  block.children.splice(idx, 1, ...newChildren)
  return true
}

function appendBlock(body, block) {
  const faqIdx = body.findIndex(
    (b) =>
      b._type === "block" &&
      b.style === "h2" &&
      b.children?.[0]?.text?.toLowerCase().includes("faq")
  )
  const insertAt = faqIdx === -1 ? body.length : faqIdx
  body.splice(insertAt, 0, block)
}

function applyHomepageLinks(articles) {
  let patched = 0

  for (const article of articles) {
    const { slug, body } = article
    if (!KEPT_BLOG_SLUGS.includes(slug)) continue
    if (slug === "retatrutide-benefits-beyond-weight-loss") continue

    if (slug === "bpc-157-vs-tb-500" && typeof body === "string") {
      if (!body.includes("[Tetrava Labs](/)")) {
        article.body = body
          .replace("For [laboratory research](/) in vitro", "For in vitro")
          .replace(
            "lot documentation in the [COA Library]",
            "lot documentation published by [Tetrava Labs](/) in the [COA Library]"
          )
        patched++
      }
      continue
    }

    if (!Array.isArray(body)) continue

    let changed = false

    if (slug === "ipamorelin-vs-sermorelin") {
      changed = moveHomeLinkToTetravaLabs(findBlock(body, "blk68"), "lnk-home-ipa")
    } else if (slug === "tesamorelin-vs-sermorelin") {
      changed = moveHomeLinkToTetravaLabs(findBlock(body, "blk57"), "lnk-home")
    } else if (slug === "selank-research-peptide") {
      changed = addHomeLinkAfterCoaLibrary(findBlock(body, "sel-coa-p2"), "sel-coa-internal", "lnk-home-sel")
    } else if (slug === "tudca-research-compound") {
      const block = findBlock(body, "tudca-concentration-3")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = block.markDefs || []
        block.markDefs.push(homeLinkMark("lnk-home-tudca"))
        const catIdx = block.children.findIndex((c) => c.marks?.includes("internal-category"))
        block.children.splice(
          catIdx + 1,
          0,
          span("tudca-home-pre", " at ", []),
          span("tudca-home-brand", "Tetrava Labs", ["lnk-home-tudca"])
        )
        changed = true
      }
    } else if (slug === "why-manufacturing-source-and-verification-matter-in-research-peptide-quality") {
      const block = findBlock(body, "p-intro-2")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = block.markDefs || []
        block.markDefs.push(homeLinkMark("lnk-home-mfg"))
        const coaIdx = block.children.findIndex((c) => c.marks?.includes("link-coa-library"))
        block.children[0].text = block.children[0].text.replace("Tetrava's ", "")
        block.children.splice(
          coaIdx + 1,
          0,
          span("mfg-home-pre", " published by ", []),
          span("mfg-home-brand", "Tetrava Labs", ["lnk-home-mfg"])
        )
        changed = true
      }
    } else if (slug === "follistatin-315-research-peptide") {
      if (!body.some((b) => b.children?.some((c) => c.text === "Tetrava Labs"))) {
        appendBlock(body, {
          _type: "block",
          _key: "fst-home-p",
          style: "normal",
          markDefs: [homeLinkMark("lnk-home-fst")],
          children: [
            span("fst-home-a", "When lot-linked FST315 records are listed for qualified laboratories, ", []),
            span("fst-home-brand", "Tetrava Labs", ["lnk-home-fst"]),
            span(
              "fst-home-b",
              " publishes batch-specific COA documentation alongside related tissue-repair research compounds. Research use only.",
              []
            )
          ]
        })
        changed = true
      }
    } else if (slug === "hexarelin-acetate-research-peptide") {
      const block = findBlock(body, "p-coa-1")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = block.markDefs || []
        block.markDefs.push(homeLinkMark("lnk-home-hex"))
        block.children.push(
          span("hex-home-pre", " Lot records published by ", []),
          span("hex-home-brand", "Tetrava Labs", ["lnk-home-hex"]),
          span("hex-home-b", " should match the vial label before any assay begins.", [])
        )
        changed = true
      }
    } else if (slug === "where-to-buy-tirzepatide-2026") {
      const block = findBlock(body, "blk44")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-tir")]
        block.children = [
          span(
            "tir-home-a",
            "Treat this as a starting map, not a ranking. ",
            []
          ),
          span("tir-home-brand", "Tetrava Labs", ["lnk-home-tir"]),
          span(
            "tir-home-b",
            " is on that map because batch-specific HPLC-MS COAs are published per lot. Before ordering from any of them, pull the COA for the specific lot being shipped, not a stock photo of one, and check that the lot number on the label matches the report.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-semaglutide-2026") {
      const block = findBlock(body, "blk42")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-sem")]
        block.children = [
          span("sem-home-a", "Price alone tells you little here. ", []),
          span("sem-home-brand", "Tetrava Labs", ["lnk-home-sem"]),
          span(
            "sem-home-b",
            " publishes batch COAs per lot on its research peptide catalog. A $100 vial with a real batch COA is a better purchase than a $60 vial with none, and a $250 vial isn't automatically better documented than a $100 one. Check the actual report before comparing the number on the label.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-hgh-191aa-2026") {
      const block = findBlock(body, "blk38")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-hgh")]
        block.children = [
          span("hgh-home-a", "The third row is the most important one. ", []),
          span("hgh-home-brand", "Tetrava Labs", ["lnk-home-hgh"]),
          span(
            "hgh-home-b",
            " publishes batch-specific COAs with stated identity-confirmation methods for full-length recombinant material. The specialist-import segment of this market is where counterfeit and under-dosed material shows up most often in reports, and price alone won't tell you which listings fall into that category. A batch-specific COA with a stated identity-confirmation method is the minimum bar for a full-length recombinant protein, not a bonus feature.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-nad-2026") {
      const block = findBlock(body, "blk40")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-nad")]
        block.children = [
          span("nad-home-a", "The distinguishing feature in that table isn't price. ", []),
          span("nad-home-brand", "Tetrava Labs", ["lnk-home-nad"]),
          span(
            "nad-home-b",
            " lists NAD+, NMN, and NR on separate product pages in plain language, without collapsing the distinction into a single marketing umbrella.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-bpc-157-2026") {
      const block = findBlock(body, "blk42")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-bpc157")]
        block.children = [
          span(
            "bpc157-home-a",
            "BPC-157 is priced closely across the mainstream research-peptide suppliers reviewed for this guide, which makes documentation quality the more useful differentiator, not price. ",
            []
          ),
          span("bpc157-home-brand", "Tetrava Labs", ["lnk-home-bpc157"]),
          span(
            "bpc157-home-b",
            " publishes batch-specific COAs with visible HPLC traces and lot numbers. One that can't should get deprioritized regardless of price.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-ghk-cu-2026") {
      const block = findBlock(body, "blk35")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-ghk")]
        block.children = [
          span("ghk-home-brand", "Tetrava Labs", ["lnk-home-ghk"]),
          span(
            "ghk-home-b",
            " sits at the low end of that comparison for an equivalent lyophilized research vial, with batch-specific COA documentation per lot. That matters because GHK-Cu's cosmetic-market crossover makes it one of the more heavily marketed compounds in the category, and price inflation tied to anti-aging branding rather than actual manufacturing cost is common across this segment.",
            []
          )
        ]
        changed = true
      }
    } else if (slug === "where-to-buy-melanotan-2-2026") {
      const block = findBlock(body, "blk34")
      if (block && !block.children.some((c) => c.text === "Tetrava Labs")) {
        block.markDefs = [homeLinkMark("lnk-home-mt2")]
        block.children = [
          span(
            "mt2-home-a",
            "The third row is where most of the documented MHRA adverse-event reports and the UK's ongoing enforcement actions against illegal tanning-injection sellers concentrate. ",
            []
          ),
          span("mt2-home-brand", "Tetrava Labs", ["lnk-home-mt2"]),
          span(
            "mt2-home-b",
            " is a meaningfully different risk profile: a documented laboratory research supplier maintaining batch-specific COAs and explicit compliance framing.",
            []
          )
        ]
        changed = true
      }
    }

    if (changed) patched++
  }

  return patched
}

function toSanityDoc(article) {
  return {
    _type: "researchArticle",
    title: article.title,
    slug: { _type: "slug", current: article.slug },
    excerpt: article.excerpt,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    keywords: article.keywords,
    category: article.category,
    readTimeMinutes: article.readTimeMinutes,
    body: article.body,
    references: article.references,
    publishedAt: article.publishedAt
  }
}

function bodyHasTetravaHomeLink(body) {
  if (typeof body === "string") {
    return body.includes("[Tetrava Labs](/)")
  }
  if (!Array.isArray(body)) return false
  for (const block of body) {
    if (!block?.markDefs || !block?.children) continue
    const homeKeys = new Set(block.markDefs.filter((m) => m.href === "/").map((m) => m._key))
    for (const child of block.children) {
      if (child.text === "Tetrava Labs" && child.marks?.some((m) => homeKeys.has(m))) {
        return true
      }
    }
  }
  return false
}

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || "production"
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.")
  process.exit(1)
}

const articles = JSON.parse(fs.readFileSync(articlesPath, "utf8"))
const linkPatches = applyHomepageLinks(articles)
fs.writeFileSync(articlesPath, `${JSON.stringify(articles, null, 2)}\n`, "utf8")
console.log(`Homepage links patched in JSON: ${linkPatches} article(s).`)

const kept = articles.filter((a) => KEPT_BLOG_SLUGS.includes(a.slug))
const missingLinks = kept.filter((a) => !bodyHasTetravaHomeLink(a.body))
if (missingLinks.length) {
  console.error("Articles still missing Tetrava Labs → / link:")
  for (const a of missingLinks) console.error(`- ${a.slug}`)
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false
})

const existing = await client.fetch(`*[_type == "researchArticle"]{ _id, "slug": slug.current }`)
const idBySlug = new Map((existing || []).map((row) => [row.slug, row._id.replace(/^drafts\./, "")]))

let upserted = 0
for (const article of kept) {
  const baseId = idBySlug.get(article.slug) || `researchArticle.${article.slug}`
  await client.createOrReplace({ ...toSanityDoc(article), _id: baseId })
  upserted++
  console.log(`Upserted: ${article.slug}`)
}

// Remove stray drafts/extra research articles not in KEPT list
const extras = await client.fetch(`*[_type == "researchArticle"]{ _id, "slug": slug.current }`)
const keepSet = new Set(KEPT_BLOG_SLUGS)
const toDelete = (extras || []).filter((doc) => !keepSet.has(doc.slug))
if (toDelete.length) {
  const tx = client.transaction()
  for (const doc of toDelete) {
    tx.delete(doc._id)
    if (!doc._id.startsWith("drafts.")) tx.delete(`drafts.${doc._id}`)
  }
  await tx.commit()
  console.log(`Removed ${toDelete.length} non-hub Sanity document(s).`)
}

console.log(`Done: ${upserted} live articles in Sanity (${dataset}); JSON fallback synced.`)
