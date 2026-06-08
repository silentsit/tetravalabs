import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import pg from "pg"

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const medusaRoot = path.resolve(__dirname, "..", "..")
dotenv.config({ path: path.join(medusaRoot, ".env") })

const schemaPath = path.resolve(__dirname, "..", "modules", "lab", "sql", "001_create_lab_tables.sql")

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("DATABASE_URL is required")
  process.exit(1)
}

const run = async () => {
  const sql = await fs.readFile(schemaPath, "utf8")
  const client = new Client({
    connectionString,
    ssl:
      connectionString.includes("neon.tech") || connectionString.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined
  })

  await client.connect()
  await client.query(sql)
  await client.end()
  console.log("Applied lab schema SQL successfully.")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
