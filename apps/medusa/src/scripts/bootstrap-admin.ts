import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, FeatureFlag, Modules } from "@medusajs/framework/utils"

export default async function bootstrapAdmin({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const authService = container.resolve(Modules.AUTH)
  const workflowService = container.resolve(Modules.WORKFLOW_ENGINE)

  const email = process.env.MEDUSA_ADMIN_EMAIL
  const password = process.env.MEDUSA_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error("MEDUSA_ADMIN_EMAIL and MEDUSA_ADMIN_PASSWORD are required in apps/medusa/.env")
  }

  let userRoles: string[] = []
  if (FeatureFlag.isFeatureEnabled("rbac")) {
    const rbacService = container.resolve(Modules.RBAC)
    const superAdminRoles = await rbacService.listRbacRoles({ id: "role_super_admin" })
    if (superAdminRoles.length > 0) {
      userRoles = [superAdminRoles[0].id]
    }
  }

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

  const user = users[0]
  const { authIdentity, error } = await authService.register("emailpass", {
    body: { email, password }
  })

  if (error) {
    throw error
  }

  await authService.updateAuthIdentities({
    id: authIdentity!.id,
    app_metadata: {
      user_id: user.id
    }
  })

  logger.info(`Admin user ready: ${email}`)
}
