import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/tetrava_medusa"

function normalizeRedisUrlInput(raw: string) {
  let value = raw.trim()

  const embedded = value.match(/rediss?:\/\/[^\s'"]+/i)
  if (embedded) {
    value = embedded[0]
  }

  if (value.includes("upstash.io") && value.startsWith("redis://")) {
    value = `rediss://${value.slice("redis://".length)}`
  }

  return value
}

function resolveRedisUrl(): string | undefined {
  if (process.env.USE_REDIS !== "true") {
    return undefined
  }

  const raw = process.env.REDIS_URL?.trim()
  if (!raw) {
    throw new Error(
      "USE_REDIS=true but REDIS_URL is missing. Set REDIS_URL on Render to your Upstash Redis URL (not the REST URL), e.g. rediss://default:TOKEN@endpoint.upstash.io:6379"
    )
  }

  const normalized = normalizeRedisUrlInput(raw)

  try {
    const parsed = new URL(normalized)
    if (parsed.protocol !== "redis:" && parsed.protocol !== "rediss:") {
      throw new Error(
        `REDIS_URL must use redis:// or rediss:// (got ${parsed.protocol}). Upstash requires rediss:// with the full connection string from the Redis tab.`
      )
    }
    return normalized
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `REDIS_URL is not a valid URL: "${raw}". Set REDIS_URL to the connection string only, e.g. rediss://default:TOKEN@endpoint.upstash.io:6379 — not the redis-cli command or REST URL.`
      )
    }
    throw error
  }
}

const REDIS_URL = resolveRedisUrl()
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000"
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7001"
const AUTH_CORS = process.env.AUTH_CORS || "http://localhost:3000"
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"
const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecret"

export default defineConfig({
  projectConfig: {
    databaseUrl: DATABASE_URL,
    redisUrl: REDIS_URL,
    http: {
      storeCors: STORE_CORS,
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET
    }
  },
  modules: REDIS_URL
    ? [
        {
          resolve: "@medusajs/medusa/cache-redis",
          options: {
            redisUrl: REDIS_URL
          }
        }
      ]
    : []
})
