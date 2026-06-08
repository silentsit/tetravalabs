const { defineConfig } = require("@medusajs/framework/utils")

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/tetrava_medusa"
const REDIS_URL = process.env.USE_REDIS === "true" ? process.env.REDIS_URL : undefined
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000"
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7001"
const AUTH_CORS = process.env.AUTH_CORS || "http://localhost:3000"
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"
const COOKIE_SECRET = process.env.COOKIE_SECRET || "supersecret"

module.exports = defineConfig({
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
