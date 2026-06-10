export default async function bootstrapAdmin({ container }) {
  const { ContainerRegistrationKeys, FeatureFlag, Modules } = await import(
    "@medusajs/framework/utils"
  )

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authService = container.resolve(Modules.AUTH)
  const userService = container.resolve(Modules.USER)
  const workflowService = container.resolve(Modules.WORKFLOW_ENGINE)

  const email = process.env.MEDUSA_ADMIN_EMAIL
  const password = process.env.MEDUSA_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD are required in apps/medusa/.env")
  }

  let userRoles = []
  if (FeatureFlag.isFeatureEnabled("rbac")) {
    const rbacService = container.resolve(Modules.RBAC)
    const superAdminRoles = await rbacService.listRbacRoles({ id: "role_super_admin" })
    if (superAdminRoles.length > 0) {
      userRoles = [superAdminRoles[0].id]
    }
  }

  const existingUsers = await userService.listUsers({ email })
  let user = existingUsers[0]

  if (!user) {
    const { result: users } = await workflowService.run("create-users-workflow", {
      input: {
        users: [
          {
            email,
            roles: userRoles
          }
        ]
      }
    })
    user = users[0]
    logger.info(`Created admin user: ${email}`)
  } else {
    logger.info(`Admin user already exists: ${email}`)
  }

  const registerResult = await authService.register("emailpass", {
    body: { email, password }
  })

  if (registerResult?.error || registerResult?.success === false) {
    const message = registerResult?.error || "register failed"
    if (message.toLowerCase().includes("already exists")) {
      const updated = await authService.updateProvider("emailpass", {
        entity_id: email,
        password
      })
      if (updated?.error) {
        throw new Error(updated.error)
      }
      if (updated?.success === false) {
        throw new Error(updated.error || "Failed to update admin password")
      }
      logger.info(`Updated admin password for ${email}`)
      return
    }
    throw new Error(message)
  }

  const authIdentity = registerResult.authIdentity

  await authService.updateAuthIdentities({
    id: authIdentity.id,
    app_metadata: {
      user_id: user.id
    }
  })

  logger.info(`Admin user ready: ${email}`)
}
