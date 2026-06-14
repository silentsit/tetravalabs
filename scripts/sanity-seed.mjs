/**
 * Seed Research Hub articles into Sanity.
 *
 * Requires in apps/storefront/.env.local (or env):
 *   SANITY_PROJECT_ID
 *   SANITY_DATASET=production
 *   SANITY_API_WRITE_TOKEN  (Editor token from sanity.io/manage)
 *
 * Usage: npm run sanity:seed
 */

import dotenv from "dotenv"
import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from "node:url"
import { createClient } from "@sanity/client"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..")

dotenv.config({ path: path.join("apps", "storefront", ".env.local") })
dotenv.config({ path: path.join("apps", "medusa", ".env") })

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || "production"
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const articlesPath = path.join(workspaceRoot, "apps", "storefront", "src", "data", "research-articles.json")
const articles = JSON.parse(fs.readFileSync(articlesPath, "utf8"))

if (!projectId || !token) {
  console.error("Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.")
  console.error("1. Create a project at https://sanity.io/manage")
  console.error("2. Add SANITY_PROJECT_ID + SANITY_API_WRITE_TOKEN to apps/storefront/.env.local")
  console.error("3. Add SANITY_PROJECT_ID + SANITY_DATASET to Vercel env")
  console.error("4. Re-run: npm run sanity:seed")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false
})

const existing = await client.fetch(
  `*[_type == "researchArticle"]{ _id, "slug": slug.current, category, readTimeMinutes, excerpt, body }`
)
const existingBySlug = new Map((existing || []).map((row) => [row.slug, row]))

let created = 0
let updated = 0
let skipped = 0

for (const article of articles) {
  const found = existingBySlug.get(article.slug)

  if (!found) {
    await client.create({
      _type: "researchArticle",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      excerpt: article.excerpt,
      category: article.category,
      readTimeMinutes: article.readTimeMinutes,
      body: article.body,
      publishedAt: article.publishedAt
    })
    created += 1
    continue
  }

  const patch = {}
  if (!found.category && article.category) patch.category = article.category
  if (!found.readTimeMinutes && article.readTimeMinutes) patch.readTimeMinutes = article.readTimeMinutes
  if (!found.excerpt?.trim() && article.excerpt) patch.excerpt = article.excerpt
  if (!found.body?.trim() && article.body) patch.body = article.body

  if (Object.keys(patch).length === 0) {
    skipped += 1
    continue
  }

  await client.patch(found._id).set(patch).commit()
  updated += 1
}

console.log(`Sanity seed complete (${created} created, ${updated} updated, ${skipped} unchanged).`)
console.log(`Project: ${projectId} / ${dataset}`)
console.log("Set SANITY_PROJECT_ID + SANITY_DATASET on Vercel, then redeploy the storefront.")

const categoryBlocks = [
  {
    categorySlug: "glp-1-incretin",
    introCopy:
      "GLP-1 and incretin research peptides for laboratory investigation of metabolic pathways, appetite signaling, and glucose regulation models.",
    supportingCopy:
      "All compounds ship lyophilized with lot-linked COA and HPLC documentation. Store at -20°C until reconstitution per your lab SOP.",
    seoTitle: "GLP-1 / Incretin — research peptides",
    seoDescription:
      "Shop GLP-1 and incretin research peptides with HPLC-MS verification and batch COAs from Tetrava Labs."
  },
  {
    categorySlug: "bpc-157-tb500",
    introCopy:
      "BPC-157 and TB-500 research peptides for in-vitro and animal model studies focused on tissue repair pathways.",
    supportingCopy:
      "Batch purity is verified by HPLC-MS. Cross-reference the COA Library before starting any experiment.",
    seoTitle: "BPC-157 / TB500 — research peptides",
    seoDescription:
      "Shop BPC-157 and TB-500 research peptides with lot-linked COA documentation for qualified laboratories."
  },
  {
    categorySlug: "blends",
    introCopy:
      "Multi-peptide research blends formulated for studies that require combined compound profiles in a single vial.",
    supportingCopy:
      "Each blend SKU includes variant-level COA documentation where published.",
    seoTitle: "Peptide blends — research compounds",
    seoDescription: "Shop multi-peptide research blends with batch COA documentation."
  },
  {
    categorySlug: "cjc-ipamorelin-ghrp",
    introCopy:
      "CJC-1295, Ipamorelin, and GHRP-class secretagogues for growth hormone axis research models.",
    supportingCopy: "Lyophilized powders with independent HPLC verification.",
    seoTitle: "CJC / Ipamorelin / GHRP — research peptides",
    seoDescription: "Shop CJC, Ipamorelin, and GHRP research peptides with COA documentation."
  },
  {
    categorySlug: "growth-hormone-axis",
    introCopy:
      "Growth hormone axis peptides including sermorelin, tesamorelin, and related secretagogues for endocrine research.",
    supportingCopy: "Cold-chain shipping available. Store sealed vials at -20°C until reconstitution.",
    seoTitle: "Growth hormone axis — research peptides",
    seoDescription: "Shop GH axis research peptides with lot-linked COAs."
  },
  {
    categorySlug: "longevity-thymic-neuropeptides",
    introCopy:
      "Longevity and neuropeptide research compounds including epithalon, selank, semax, and thymic peptides.",
    supportingCopy: "Lot-linked analytical documentation supports reproducible experimental design.",
    seoTitle: "Longevity & neuropeptides — research compounds",
    seoDescription: "Shop longevity and neuropeptide research compounds with COA documentation."
  },
  {
    categorySlug: "supplies-reconstitution",
    introCopy:
      "BAC water, acetic acid, and reconstitution supplies required for peptide preparation in the lab.",
    supportingCopy: "Pair with your peptide order to streamline reconstitution workflows.",
    seoTitle: "Lab supplies & reconstitution",
    seoDescription: "Shop BAC water and reconstitution supplies for peptide research labs."
  }
]

const existingCategories = await client.fetch(
  `*[_type == "categorySeoBlock"]{ categorySlug }`
)
const existingCategorySlugs = new Set((existingCategories || []).map((row) => row.categorySlug))

for (const block of categoryBlocks) {
  if (existingCategorySlugs.has(block.categorySlug)) continue
  await client.create({ _type: "categorySeoBlock", ...block })
  console.log(`Created category SEO block: ${block.categorySlug}`)
}

const legalPages = [
  {
    type: "terms",
    version: "1.0",
    content:
      "These terms govern your use of the Tetrava Labs website and purchase of research compounds.\n\n" +
      "By placing an order, you confirm eligibility as a qualified research buyer and acceptance of our Research Use Only policy.\n\n" +
      "Products are provided without warranty beyond documented batch specifications."
  },
  {
    type: "privacy",
    version: "1.0",
    content:
      "Tetrava Labs collects order and contact information required to fulfill research compound purchases.\n\n" +
      "We do not sell personal data. Payment processors handle crypto transaction metadata according to their policies.\n\n" +
      "Contact support@tetravalabs.com for data access or deletion requests."
  }
]

const existingLegal = await client.fetch(`*[_type == "legalPage"]{ type }`)
const existingLegalTypes = new Set((existingLegal || []).map((row) => row.type))

for (const page of legalPages) {
  if (existingLegalTypes.has(page.type)) continue
  await client.create({
    _type: "legalPage",
    type: page.type,
    content: page.content,
    version: page.version,
    publishedAt: new Date().toISOString()
  })
  console.log(`Created legal page: ${page.type}`)
}
