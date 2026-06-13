import dotenv from "dotenv"
import path from "node:path"
import pg from "pg"

dotenv.config({ path: path.join("apps", "medusa", ".env") })

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("localhost") ? undefined : { rejectUnauthorized: false }
})

await client.connect()
const users = await client.query(`SELECT id, email, created_at FROM "user" WHERE deleted_at IS NULL ORDER BY email`)
console.log("Users:", users.rows)

const tables = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name LIKE '%auth%'
  ORDER BY table_name
`)
console.log("Auth tables:", tables.rows.map((r) => r.table_name))

await client.end()
