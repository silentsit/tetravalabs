/**
 * Trigger a full Typesense reindex via the Medusa sync hook.
 *
 * Requires TYPESENSE_SYNC_SECRET in apps/medusa/.env (same value as Render Medusa).
 *
 * Usage:
 *   node scripts/sync-typesense-production.mjs
 *   node scripts/sync-typesense-production.mjs --dry-run
 */

import dotenv from "dotenv"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..")

dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })

const dryRun = process.argv.includes("--dry-run")
const medusaUrl = (process.env.MEDUSA_ADMIN_URL || "https://tetrava-medusa.onrender.com").replace(/\/$/, "")
const secret = process.env.TYPESENSE_SYNC_SECRET?.trim()

if (!secret) {
  console.error("Missing TYPESENSE_SYNC_SECRET in apps/medusa/.env")
  process.exit(1)
}

const url = `${medusaUrl}/hooks/typesense/sync`
const body = JSON.stringify({ action: "full" })

if (dryRun) {
  console.log(`[dry-run] POST ${url}`)
  console.log(`[dry-run] x-typesense-sync-secret: ${secret.slice(0, 4)}…`)
  process.exit(0)
}

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-typesense-sync-secret": secret
  },
  body
})

const text = await response.text()
let data
try {
  data = JSON.parse(text)
} catch {
  data = text
}

console.log(`Status: ${response.status}`)
console.log(JSON.stringify(data, null, 2))

if (!response.ok) {
  process.exit(1)
}
