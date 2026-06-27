import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

function normalizeDatabaseUrl(raw: string) {
  let url = raw.trim()

  // channel_binding=require breaks many Node/pg and GUI clients against Neon.
  url = url
    .replace(/([?&])channel_binding=require&/i, "$1")
    .replace(/([?&])channel_binding=require(?=&|$)/i, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "")

  return url
}

function resolveDatabaseUrl() {
  const raw = process.env.DATABASE_URL?.trim()
  if (raw) return normalizeDatabaseUrl(raw)

  if ((process.env.NODE_ENV || "development") === "production") {
    throw new Error(
      "DATABASE_URL is missing. Set DATABASE_URL on Render to your Neon PostgreSQL connection string (Neon Dashboard → Connect → copy the pooled or direct URL with sslmode=require)."
    )
  }

  return "postgres://postgres:postgres@localhost:5432/tetrava_medusa"
}

const DATABASE_URL = resolveDatabaseUrl()

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

function isAdminDisabled(): boolean {
  if (process.env.ENABLE_MEDUSA_ADMIN === "true") {
    return false
  }
  if (process.env.DISABLE_MEDUSA_ADMIN === "true") {
    return true
  }
  return process.env.NODE_ENV === "production"
}

const STOREFRONT_URL = (process.env.STOREFRONT_URL || "http://localhost:3000").replace(/\/$/, "")

function buildAuthModule() {
  const providers: Array<{
    resolve: string
    id: string
    options?: Record<string, string>
  }> = [
    {
      resolve: "@medusajs/medusa/auth-emailpass",
      id: "emailpass"
    }
  ]

  const googleClientId = process.env.MEDUSA_AUTH_GOOGLE_CLIENT_ID?.trim()
  const googleClientSecret = process.env.MEDUSA_AUTH_GOOGLE_CLIENT_SECRET?.trim()
  if (googleClientId && googleClientSecret) {
    providers.push({
      resolve: "@medusajs/medusa/auth-google",
      id: "google",
      options: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        callbackUrl: `${STOREFRONT_URL}/account/oauth/google/callback`
      }
    })
  }

  const appleClientId = process.env.MEDUSA_AUTH_APPLE_CLIENT_ID?.trim()
  const appleTeamId = process.env.MEDUSA_AUTH_APPLE_TEAM_ID?.trim()
  const appleKeyId = process.env.MEDUSA_AUTH_APPLE_KEY_ID?.trim()
  const applePrivateKey = process.env.MEDUSA_AUTH_APPLE_PRIVATE_KEY?.trim()
  if (appleClientId && appleTeamId && appleKeyId && applePrivateKey) {
    providers.push({
      resolve: "./src/providers/auth-apple",
      id: "apple",
      options: {
        clientId: appleClientId,
        teamId: appleTeamId,
        keyId: appleKeyId,
        privateKey: applePrivateKey.replace(/\\n/g, "\n"),
        callbackUrl: `${STOREFRONT_URL}/account/oauth/apple/callback`
      }
    })
  }

  return {
    resolve: "@medusajs/medusa/auth",
    options: { providers }
  }
}

export default defineConfig({
  admin: {
    disable: isAdminDisabled()
  },
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
  modules: [
    buildAuthModule(),
    ...(REDIS_URL
      ? [
          {
            resolve: "@medusajs/medusa/cache-redis",
            options: {
              redisUrl: REDIS_URL
            }
          }
        ]
      : [])
  ]
})
