/**
 * Keep only the current Research Hub posts in Sanity.
 * Deletes every other `researchArticle` document, including drafts.
 *
 * Requires SANITY_PROJECT_ID + SANITY_API_WRITE_TOKEN.
 * Usage: npm run sanity:prune-blog
 */

import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createClient } from "@sanity/client"

const KEPT_BLOG_SLUGS = [
  "retatrutide-benefits-beyond-weight-loss",
  "bpc-157-vs-tb-500"
]

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, "..", "apps", "storefront", ".env.local") })
dotenv.config({ path: path.join(__dirname, "..", "apps", "medusa", ".env") })

const projectId = process.env.SANITY_PROJECT_ID || "qs2hhkk7"
const dataset = process.env.SANITY_DATASET || "production"
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN
const keep = new Set(KEPT_BLOG_SLUGS)

if (!token) {
  console.error("Missing SANITY_API_WRITE_TOKEN. Cannot delete live Sanity articles.")
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false
})

const docs = await client.fetch(
  `*[_type == "researchArticle"]{_id, "slug": slug.current, title, publishedAt}`
)

const toDelete = (docs || []).filter((doc) => !keep.has(doc.slug))
if (!toDelete.length) {
  console.log("No extra Sanity research articles to delete.")
  process.exit(0)
}

console.log(`Deleting ${toDelete.length} Sanity research article(s):`)
for (const doc of toDelete) {
  console.log(`- ${doc.slug} (${doc._id})`)
}

const tx = client.transaction()
for (const doc of toDelete) {
  tx.delete(doc._id)
  if (!doc._id.startsWith("drafts.")) {
    tx.delete(`drafts.${doc._id}`)
  }
}
await tx.commit()
console.log("Sanity research articles pruned.")
