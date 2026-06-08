import { Pool } from "pg"

let pool: Pool | null = null

export function getDbPool() {
  if (pool) return pool
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) return null

  pool = new Pool({
    connectionString,
    ssl:
      connectionString.includes("neon.tech") || connectionString.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined
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
