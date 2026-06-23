import fs from "node:fs/promises"
import fsSync from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const medusaRoot = path.resolve(__dirname, "..", "..")

function loadEnvFile(filePath) {
  if (!fsSync.existsSync(filePath)) return
  const content = fsSync.readFileSync(filePath, "utf8")
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const separator = trimmed.indexOf("=")
    if (separator === -1) continue
    const key = trimmed.slice(0, separator).trim()
    let value = trimmed.slice(separator + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.join(medusaRoot, ".env"))

const sqlDir = path.resolve(__dirname, "..", "modules", "lab", "sql")

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const run = async () => {
  const files = (await fs.readdir(sqlDir))
    .filter((name) => name.endsWith(".sql"))
    .sort()

  const client = new Client({
    connectionString,
    ssl:
      connectionString.includes("neon.tech") || connectionString.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined
  })

  await client.connect()
  for (const file of files) {
    const sql = await fs.readFile(path.join(sqlDir, file), "utf8")
    await client.query(sql)
    console.log(`Applied ${file}`)
  }
  await client.end()
  console.log("Applied lab schema SQL successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
