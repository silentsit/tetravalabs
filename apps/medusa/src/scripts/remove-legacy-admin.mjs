import dotenv from "dotenv"
import pg from "pg"

dotenv.config()

export default async function removeLegacyAdmin({ container }) {
  const { ContainerRegistrationKeys } = await import("@medusajs/framework/utils")
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const legacyEmail = (process.env.LEGACY_ADMIN_EMAIL || "admin@tetravalabs.com").trim()
  const keepEmail = (process.env.MEDUSA_ADMIN_EMAIL || "info@tetravalabs.com").trim()

  if (!legacyEmail || legacyEmail === keepEmail) {
    throw new Error(`Refusing to remove active admin email (${legacyEmail})`)
  }

  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes("localhost") ? undefined : { rejectUnauthorized: false }
  })

  await client.connect()

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

    await client.query(`DELETE FROM user_rbac_role WHERE user_id = $1`, [user.id])
    await client.query(`DELETE FROM user_preference WHERE user_id = $1`, [user.id])

    await client.query("COMMIT")
    logger.info(`Removed legacy admin user: ${legacyEmail}`)
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    await client.end()
  }
}
