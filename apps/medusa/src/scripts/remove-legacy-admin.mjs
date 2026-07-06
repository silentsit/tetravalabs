import dotenv from "dotenv"
import pg from "pg"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const medusaRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..")
const { applyDatabaseUrlEnv, pgSslOptions } = require(path.join(
  medusaRoot,
  "src/lib/database-url.cjs"
))

dotenv.config({ path: path.join(medusaRoot, ".env") })
applyDatabaseUrlEnv()

export default async function removeLegacyAdmin({ container }) {
  const { ContainerRegistrationKeys } = await import("@medusajs/framework/utils")
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const legacyEmail = (process.env.LEGACY_ADMIN_EMAIL || "admin@tetravalabs.com").trim()
  const keepEmail = (process.env.MEDUSA_ADMIN_EMAIL || "info@tetravalabs.com").trim()

  if (!legacyEmail || legacyEmail === keepEmail) {
    throw new Error(`Refusing to remove active admin email (${legacyEmail})`)
  }

  const connectionString = process.env.DATABASE_URL
  const client = new pg.Client({
    connectionString,
    ssl: pgSslOptions(connectionString || "")
  })

  await client.connect()

  let inTransaction = false

  try {
    const userResult = await client.query(`SELECT id, email FROM "user" WHERE email = $1 AND deleted_at IS NULL`, [
      legacyEmail
    ])
    const user = userResult.rows[0]

    if (!user) {
      logger.info(`Legacy admin not found (${legacyEmail}) — nothing to remove.`)
      return
    }

    const authResult = await client.query(
      `SELECT id FROM auth_identity WHERE app_metadata->>'user_id' = $1 AND deleted_at IS NULL`,
      [user.id]
    )
    const authIdentityId = authResult.rows[0]?.id

    await client.query("BEGIN")
    inTransaction = true

    await client.query(
      `UPDATE provider_identity SET deleted_at = NOW(), updated_at = NOW()
       WHERE entity_id = $1 AND deleted_at IS NULL`,
      [legacyEmail]
    )

    if (authIdentityId) {
      await client.query(
        `UPDATE auth_identity SET deleted_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND deleted_at IS NULL`,
        [authIdentityId]
      )
    }

    await client.query(
      `UPDATE "user" SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL`,
      [user.id]
    )

    await client.query(`DELETE FROM user_rbac_role WHERE user_id = $1`, [user.id]).catch(() => undefined)
    await client.query(`DELETE FROM user_preference WHERE user_id = $1`, [user.id]).catch(() => undefined)

    await client.query("COMMIT")
    logger.info(`Removed legacy admin user: ${legacyEmail}`)
  } catch (error) {
    if (inTransaction) {
      await client.query("ROLLBACK").catch(() => undefined)
    }
    throw error
  } finally {
    await client.end()
  }
}
