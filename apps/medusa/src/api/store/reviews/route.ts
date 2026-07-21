import type { AuthenticatedMedusaRequest, MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { withDb } from "../../../lib/db"
import {
  buildViewerContext,
  getCustomerEmail,
  customerPurchasedProduct,
  getReviewAggregate,
  listReviewsByHandle,
  mapReviewRow,
  insertReview,
  updateReviewContent,
  normalizeAdminAuthorName,
  normalizeAdminBody,
  normalizeAdminRating,
  normalizeAuthorName,
  normalizeBody,
  normalizeRating,
  getCustomerReviewForProduct
} from "../../../lib/reviews"
import { isStoreAdminEmail } from "../../../lib/store-admin"

type PostBody = {
  product_id?: string
  product_handle?: string
  rating?: number
  body?: string
  author_name?: string
}

/**
 * GET /store/reviews?product_handle=...
 * Optional auth: when signed in, includes viewer eligibility for the review form.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productHandle = String(req.query.product_handle || "").trim()
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)

  if (!productHandle) {
    return res.status(400).json({ message: "product_handle is required" })
  }

  const payload = await withDb(
    async (db) => {
      const [items, aggregate] = await Promise.all([
        listReviewsByHandle(db, productHandle, limit),
        getReviewAggregate(db, productHandle)
      ])

      const authReq = req as AuthenticatedMedusaRequest
      const customerId = authReq.auth_context?.actor_id
      const productId = String(req.query.product_id || "").trim()

      let viewer: Awaited<ReturnType<typeof buildViewerContext>> | null = null
      if (customerId && productId) {
        viewer = await buildViewerContext(req.scope, db, customerId, productId, productHandle)
      }

      return {
        product_handle: productHandle,
        count: aggregate.reviewCount,
        aggregate,
        items: items.map(mapReviewRow),
        viewer
      }
    },
    async () => ({
      product_handle: productHandle,
      count: 0,
      aggregate: { ratingValue: 0, reviewCount: 0 },
      items: [],
      viewer: null
    })
  )

  return res.json(payload)
}

/**
 * POST /store/reviews
 * Verified purchasers may review once per product. Admins may post unlimited reviews under custom names.
 */
export const POST = async (req: AuthenticatedMedusaRequest<PostBody>, res: MedusaResponse) => {
  const customerId = req.auth_context?.actor_id
  if (!customerId) {
    return res.status(401).json({ message: "Sign in to leave a review." })
  }

  const productId = String(req.body?.product_id || "").trim()
  const productHandle = String(req.body?.product_handle || "").trim()

  const email = await getCustomerEmail(req.scope, customerId)
  const isAdmin = isStoreAdminEmail(email)
  const purchased = await customerPurchasedProduct(req.scope, customerId, productHandle, productId)

  if (!productId || !productHandle) {
    return res.status(400).json({ message: "product_id and product_handle are required" })
  }

  if (!isAdmin && !purchased) {
    return res.status(403).json({
      message: "Only accounts that have purchased this product before can post a review."
    })
  }

  const rating = isAdmin ? normalizeAdminRating(req.body?.rating) : normalizeRating(req.body?.rating)
  const body = isAdmin ? normalizeAdminBody(req.body?.body) : normalizeBody(req.body?.body)

  if (!rating) {
    return res.status(400).json({
      message: isAdmin ? "rating must be at least 1" : "rating must be between 1 and 5"
    })
  }
  if (!body) {
    return res.status(400).json({
      message: isAdmin ? "Review text is required" : "Review must be between 10 and 2000 characters"
    })
  }

  let authorName: string | null = null
  if (isAdmin) {
    authorName = normalizeAdminAuthorName(req.body?.author_name)
    if (!authorName) {
      return res.status(400).json({ message: "Admin reviews require a display name." })
    }
  } else {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const { data } = await query.graph({
      entity: "customer",
      fields: ["first_name", "last_name", "email"],
      filters: { id: customerId }
    })
    const customer = data?.[0] as
      | { first_name?: string | null; last_name?: string | null; email?: string | null }
      | undefined
    const fullName = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ").trim()
    authorName = normalizeAuthorName(fullName) || normalizeAuthorName(customer?.email?.split("@")[0])
    if (!authorName) {
      return res.status(400).json({ message: "Could not determine reviewer name for your account." })
    }
  }

  const review = await withDb(
    async (db) => {
      if (isAdmin) {
        return insertReview(db, {
          productId,
          productHandle,
          customerId,
          authorName: authorName!,
          rating,
          body
        })
      }

      const existing = await getCustomerReviewForProduct(db, productId, customerId)
      if (existing) {
        return updateReviewContent(db, existing.id, customerId, {
          authorName: authorName!,
          rating,
          body
        })
      }

      return insertReview(db, {
        productId,
        productHandle,
        customerId,
        authorName: authorName!,
        rating,
        body
      })
    },
    async () => null
  )

  if (!review) {
    return res.status(503).json({ message: "Reviews are temporarily unavailable." })
  }

  return res.status(201).json({ review: mapReviewRow(review) })
}
