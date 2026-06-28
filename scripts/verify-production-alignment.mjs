/**
 * Verify local Neon DB aligns with deployed Render Medusa.
 * Compares publishable keys in apps/medusa/.env DB against Render /store API.
 */

import dotenv from "dotenv"
import pg from "pg"
import path from "node:path"

dotenv.config({ path: path.join("apps", "medusa", ".env") })

const medusaUrl = (process.env.MEDUSA_ADMIN_URL || "https://tetrava-medusa-i44n.onrender.com").replace(
  /\/$/,
  ""
)

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error("DATABASE_URL missing in apps/medusa/.env")
  process.exit(1)
}

const dbHost = new URL(databaseUrl).hostname

const client = new pg.Client({ connectionString: databaseUrl })
await client.connect()

const keys = await client.query(
  `SELECT token, title FROM api_key WHERE type='publishable' AND revoked_at IS NULL ORDER BY created_at`
)
const productCount = await client.query(`SELECT COUNT(*)::int AS count FROM product`)
await client.end()

console.log("Production alignment check\n")
console.log(`Local Neon host: ${dbHost}`)
console.log(`Products in local DATABASE_URL: ${productCount.rows[0].count}`)
console.log(`Publishable keys in DB: ${keys.rows.length}`)
console.log(`Render Medusa URL: ${medusaUrl}\n`)

let aligned = false
for (const row of keys.rows) {
  const response = await fetch(`${medusaUrl}/store/products?limit=1`, {
    headers: { "x-publishable-api-key": row.token }
  })
  const data = await response.json()
  const ok = response.ok && typeof data.count === "number"
  console.log(
    `[${ok ? "ok" : "fail"}] ${row.title} (${row.token.slice(0, 12)}...) -> ${response.status} ${data.type || `count=${data.count}`}`
  )
  if (ok) aligned = true
}

if (!aligned) {
  console.log("\nRender Medusa does not recognize keys from your local DATABASE_URL.")
  console.log("Fix: In Render dashboard, set DATABASE_URL to the same Neon connection string")
  console.log("as apps/medusa/.env, then redeploy tetrava-medusa.")
  console.log(`Expected Neon host: ${dbHost}`)
  process.exit(1)
}

console.log("\nRender and local DATABASE_URL appear aligned.")
console.log("Next: npm run production:setup:run")
