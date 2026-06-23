import dotenv from "dotenv"

dotenv.config()

export default async function bootstrapCustomer({ container }) {
  const { ContainerRegistrationKeys, Modules } = await import("@medusajs/framework/utils")
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const customerService = container.resolve(Modules.CUSTOMER)
  const authService = container.resolve(Modules.AUTH)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const email = (process.env.STOREFRONT_CUSTOMER_EMAIL || process.env.MEDUSA_ADMIN_EMAIL || "").trim()
  if (!email) {
    throw new Error("Set MEDUSA_ADMIN_EMAIL or STOREFRONT_CUSTOMER_EMAIL in apps/medusa/.env")
  }

  const { data: existingCustomers } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: { email }
  })

  let customer = existingCustomers?.[0]
  if (!customer) {
    customer = await customerService.createCustomers({
      email,
      first_name: "Tetrava",
      last_name: "Labs",
      has_account: true
    })
    logger.info(`Created storefront customer: ${email}`)
  } else {
    logger.info(`Storefront customer already exists: ${email}`)
  }

  const providerIdentities = await authService.listProviderIdentities({ entity_id: email })
  const providerIdentity = providerIdentities[0]
  if (!providerIdentity?.auth_identity_id) {
    throw new Error(
      `No auth identity for ${email}. Register at /register or run bootstrap:admin first.`
    )
  }

  const authIdentities = await authService.listAuthIdentities({ id: providerIdentity.auth_identity_id })
  const authIdentity = authIdentities[0]
  if (!authIdentity) {
    throw new Error(`Auth identity ${providerIdentity.auth_identity_id} not found for ${email}`)
  }

  const metadata = authIdentity.app_metadata || {}
  if (metadata.customer_id === customer.id) {
    logger.info(`Auth identity already linked to customer ${customer.id}`)
    return
  }

  await authService.updateAuthIdentities({
    id: authIdentity.id,
    app_metadata: {
      ...metadata,
      customer_id: customer.id
    }
  })

  logger.info(`Linked storefront customer ${customer.id} to auth identity for ${email}`)
}
