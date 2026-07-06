import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import pg from "pg"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const medusaRoot = path.resolve(__dirname, "..", "..")
const workspaceRoot = path.resolve(medusaRoot, "..", "..")
const { applyDatabaseUrlEnv, pgSslOptions } = require(path.join(
  medusaRoot,
  "src/lib/database-url.cjs"
))

dotenv.config({ path: path.join(medusaRoot, ".env") })
applyDatabaseUrlEnv()

const samplePath = path.join(workspaceRoot, "packages", "catalog", "output", "coa-docs.sample.json")
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const run = async () => {
  const docs = JSON.parse(await fs.readFile(samplePath, "utf8"))
  const client = new Client({
    connectionString,
    ssl: pgSslOptions(connectionString)
  })
  await client.connect()

  for (const doc of docs) {
    await client.query(
      `
      INSERT INTO lab_batch_documents (
        id, variant_id, batch_number, purity_percent, tested_at, document_type, document_url, metadata
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      ON CONFLICT (id) DO UPDATE SET
        batch_number = EXCLUDED.batch_number,
        purity_percent = EXCLUDED.purity_percent,
        tested_at = EXCLUDED.tested_at,
        document_url = EXCLUDED.document_url,
        metadata = EXCLUDED.metadata
    `,
      [
        doc.id,
        doc.variant_id,
        doc.batch_number,
        doc.purity_percent ?? null,
        doc.tested_at ?? null,
        doc.document_type,
        doc.document_url,
        doc.metadata || {}
      ]
    )
  }

  await client.end()
  console.log(`Imported ${docs.length} COA/HPLC documents`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
