import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { withDb } from "../../../../lib/db"
import { deleteReviewById, getCustomerEmail, getReviewById } from "../../../../lib/reviews"
import { isStoreAdminEmail } from "../../../../lib/store-admin"

/**
 * DELETE /store/reviews/:id
 * Admin-only review removal.
 */
export const DELETE = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Sign in required." })
  }

  const reviewId = String(req.params.id || "").trim()
  if (!reviewId) {
    return res.status(400).json({ message: "Review id is required." })
  }

  const email = await getCustomerEmail(req.scope, customerId)
  if (!isStoreAdminEmail(email)) {
    return res.status(403).json({ message: "Only admin accounts can delete reviews." })
  }

  const deleted = await withDb(
    async (db) => {
      const existing = await getReviewById(db, reviewId)
      if (!existing) return false
      return deleteReviewById(db, reviewId)
    },
    async () => false
  )

  if (!deleted) {
    return res.status(404).json({ message: "Review not found." })
  }

  return res.status(200).json({ deleted: true, id: reviewId })
}
