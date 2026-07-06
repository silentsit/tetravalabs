import { Pool } from "pg"
import { normalizeDatabaseUrl, pgSslOptions } from "./database-url"

let pool: Pool | null = null

export function getDbPool() {
  if (pool) return pool
  const raw = process.env.DATABASE_URL
  if (!raw) return null

  const connectionString = normalizeDatabaseUrl(raw)

  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    ssl: pgSslOptions(connectionString)
  })

  pool.on("error", (error) => {
    console.warn("[db] idle pool connection dropped:", error.message)
  })

  return pool
}

export async function withDb<T>(
  fn: (db: Pool) => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  const db = getDbPool()
  if (!db) return fallback()
  try {
    return await fn(db)
  } catch (error) {
    console.warn("[db] query failed, returning fallback:", error)
    return fallback()
  }
}
