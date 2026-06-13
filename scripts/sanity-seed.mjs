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
import { createClient } from "@sanity/client"

dotenv.config({ path: path.join("apps", "storefront", ".env.local") })
dotenv.config({ path: path.join("apps", "medusa", ".env") })

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET || "production"
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN

const articles = [
  {
    title: "RUO Handling and Storage Basics",
    slug: "ruo-handling-and-storage-basics",
    excerpt: "Storage, reconstitution, and handling best practices for peptide research materials.",
    publishedAt: "2026-05-15T00:00:00.000Z",
    body:
      "Research-use-only peptides should be stored lyophilized at -20°C until reconstitution. Limit freeze-thaw cycles and document batch IDs for every vial used in a study.\n\n" +
      "After reconstitution, use bacteriostatic water or the appropriate solvent noted on the product label. Label vials with compound, concentration, and date opened. Most reconstituted materials are stable for a limited window at 2–8°C — follow your lab SOP.\n\n" +
      "Always cross-reference the batch COA in our COA Library before starting an experiment."
  },
  {
    title: "How to Read COA and HPLC Reports",
    slug: "how-to-read-coa-and-hplc-reports",
    excerpt: "A practical guide to interpreting purity and analytical outputs.",
    publishedAt: "2026-05-20T00:00:00.000Z",
    body:
      "A Certificate of Analysis (COA) confirms identity and purity for a specific batch. Look for batch number, test date, and reported purity percentage.\n\n" +
      "HPLC chromatograms show peak area for the target compound versus impurities. A single dominant peak near the expected retention time with minimal secondary peaks generally indicates higher purity.\n\n" +
      "Compare COA and HPLC documents together — COA summarizes acceptance criteria while HPLC provides the underlying chromatographic evidence."
  },
  {
    title: "Semaglutide Storage Protocols for Research Labs",
    slug: "semaglutide-storage-protocols",
    excerpt: "Cold-chain and lyophilized storage guidance for GLP-1 research materials.",
    publishedAt: "2026-06-01T00:00:00.000Z",
    body:
      "GLP-1 receptor agonist peptides are sensitive to heat and repeated moisture exposure. Keep lyophilized vials sealed until use and store at -20°C.\n\n" +
      "Reconstitute only the amount required for the current experimental window. Avoid agitation that introduces foaming, and use low-bind pipette tips for accurate volumetric work.\n\n" +
      "Document the batch COA ID in your lab notebook — Tetrava publishes batch-level documents for every catalog SKU in the COA Library."
  }
]

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
  `*[_type == "researchArticle"]{ "slug": slug.current }`
)
const existingSlugs = new Set((existing || []).map((row) => row.slug))

let created = 0
let skipped = 0

for (const article of articles) {
  if (existingSlugs.has(article.slug)) {
    skipped += 1
    continue
  }

  await client.create({
    _type: "researchArticle",
    title: article.title,
    slug: { _type: "slug", current: article.slug },
    excerpt: article.excerpt,
    body: article.body,
    publishedAt: article.publishedAt
  })
  created += 1
}

console.log(`Sanity seed complete (${created} created, ${skipped} skipped).`)
console.log(`Project: ${projectId} / ${dataset}`)
console.log("Set SANITY_PROJECT_ID + SANITY_DATASET on Vercel, then redeploy the storefront.")
