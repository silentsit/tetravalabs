import { Pool } from "pg"

let pool: Pool | null = null

export function getDbPool() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  const isRemote =
    connectionString.includes("neon.tech") ||
    connectionString.includes("supabase") ||
    !connectionString.includes("localhost")

  pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 10_000,
    ssl: isRemote ? { rejectUnauthorized: false } : undefined
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
