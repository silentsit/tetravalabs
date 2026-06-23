import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createCustomerAccountWorkflow } from "@medusajs/core-flows"
import { MedusaError, Modules } from "@medusajs/framework/utils"

type ProviderMetadata = {
  email?: string
  given_name?: string
  family_name?: string
  name?: string
}

function splitName(fullName?: string) {
  if (!fullName?.trim()) return { firstName: "Customer", lastName: "" }
  const parts = fullName.trim().split(/\s+/)
  return {
    firstName: parts[0] || "Customer",
    lastName: parts.slice(1).join(" ")
  }
}

/**
 * POST /store/auth/oauth-complete
 * Ensures an authenticated OAuth identity has a linked Medusa customer record.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const actorId = req.auth_context?.actor_id
  if (actorId) {
    return res.status(200).json({ customer_id: actorId, created: false })
  }

  const authIdentityId = req.auth_context?.auth_identity_id
  if (!authIdentityId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "Authentication required")
  }

  const authService = req.scope.resolve(Modules.AUTH)
  const providerIdentities = await authService.listProviderIdentities({
    auth_identity_id: authIdentityId
  })

  const providerIdentity = providerIdentities[0]
  const metadata = (providerIdentity?.user_metadata || {}) as ProviderMetadata
  const email = metadata.email

  if (!email) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Email not available from the sign-in provider."
    )
  }

  const { firstName, lastName } = splitName(metadata.name)

  const workflow = createCustomerAccountWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      customerData: {
        email,
        first_name: metadata.given_name || firstName,
        last_name: metadata.family_name || lastName,
        has_account: true
      },
      authIdentityId
    }
  })

  return res.status(200).json({ customer_id: result.id, created: true })
}
