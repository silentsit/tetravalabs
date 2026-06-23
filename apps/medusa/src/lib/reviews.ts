import { randomUUID } from "node:crypto"
import type { Pool } from "pg"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import { isStoreAdminEmail } from "./store-admin"

export type ProductReviewRow = {
  id: string
  product_id: string
  product_handle: string
  customer_id: string
  author_name: string
  rating: number
  body: string
  created_at: string
  updated_at: string
}

export type ReviewAggregate = {
  ratingValue: number
  reviewCount: number
}

type CreateReviewInput = {
  productId: string
  productHandle: string
  customerId: string
  authorName: string
  rating: number
  body: string
}

export function mapReviewRow(row: ProductReviewRow) {
  return {
    id: row.id,
    product_id: row.product_id,
    product_handle: row.product_handle,
    customer_id: row.customer_id,
    author_name: row.author_name,
    rating: row.rating,
    body: row.body,
    created_at: row.created_at,
    updated_at: row.updated_at
  }
}

export async function listReviewsByHandle(db: Pool, productHandle: string, limit = 50) {
  const result = await db.query<ProductReviewRow>(
    `
    SELECT id, product_id, product_handle, customer_id, author_name, rating, body, created_at, updated_at
    FROM product_reviews
    WHERE product_handle = $1
    ORDER BY created_at DESC
    LIMIT $2
    `,
    [productHandle, limit]
  )
  return result.rows
}

export async function getReviewAggregate(db: Pool, productHandle: string): Promise<ReviewAggregate> {
  const result = await db.query<{ avg_rating: string | null; review_count: string }>(
    `
    SELECT AVG(rating)::numeric(3,2) AS avg_rating, COUNT(*)::int AS review_count
    FROM product_reviews
    WHERE product_handle = $1
    `,
    [productHandle]
  )

  const row = result.rows[0]
  const reviewCount = Number(row?.review_count || 0)
  const ratingValue = reviewCount ? Number(row?.avg_rating || 0) : 0

  return {
    ratingValue: Number(ratingValue.toFixed(1)),
    reviewCount
  }
}

export async function getCustomerReviewForProduct(
  db: Pool,
  productId: string,
  customerId: string
): Promise<ProductReviewRow | null> {
  const result = await db.query<ProductReviewRow>(
    `
    SELECT id, product_id, product_handle, customer_id, author_name, rating, body, created_at, updated_at
    FROM product_reviews
    WHERE product_id = $1 AND customer_id = $2
    LIMIT 1
    `,
    [productId, customerId]
  )
  return result.rows[0] || null
}

export async function getReviewById(db: Pool, id: string): Promise<ProductReviewRow | null> {
  const result = await db.query<ProductReviewRow>(
    `
    SELECT id, product_id, product_handle, customer_id, author_name, rating, body, created_at, updated_at
    FROM product_reviews
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  )
  return result.rows[0] || null
}

export async function deleteReviewById(db: Pool, id: string): Promise<boolean> {
  const result = await db.query(`DELETE FROM product_reviews WHERE id = $1`, [id])
  return (result.rowCount || 0) > 0
}

export async function upsertReview(db: Pool, input: CreateReviewInput): Promise<ProductReviewRow> {
  const id = randomUUID()
  const result = await db.query<ProductReviewRow>(
    `
    INSERT INTO product_reviews (
      id, product_id, product_handle, customer_id, author_name, rating, body
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (product_id, customer_id) DO UPDATE SET
      author_name = EXCLUDED.author_name,
      rating = EXCLUDED.rating,
      body = EXCLUDED.body,
      updated_at = NOW()
    RETURNING id, product_id, product_handle, customer_id, author_name, rating, body, created_at, updated_at
    `,
    [id, input.productId, input.productHandle, input.customerId, input.authorName, input.rating, input.body]
  )
  return result.rows[0]
}

export async function getCustomerEmail(scope: MedusaContainer, customerId: string): Promise<string | null> {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "customer",
    fields: ["id", "email"],
    filters: { id: customerId }
  })

  const customer = data?.[0] as { email?: string | null } | undefined
  return customer?.email?.trim().toLowerCase() || null
}

export async function customerPurchasedProduct(
  scope: MedusaContainer,
  customerId: string,
  productHandle: string,
  productId: string
): Promise<boolean> {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: orders } = await query.graph({
    entity: "order",
    fields: ["id", "status", "items.product_id", "items.product.handle"],
    filters: {
      customer_id: customerId,
      is_draft_order: false
    }
  })

  return (orders || []).some((order) => {
    const status = String((order as { status?: string }).status || "").toLowerCase()
    if (status === "canceled") return false

    const items = (order as { items?: Array<{ product_id?: string; product?: { handle?: string } }> }).items || []
    return items.some(
      (item) => item.product_id === productId || item.product?.handle === productHandle
    )
  })
}

export async function buildViewerContext(
  scope: MedusaContainer,
  db: Pool,
  customerId: string,
  productId: string,
  productHandle: string
) {
  const [email, purchased, existingReview] = await Promise.all([
    getCustomerEmail(scope, customerId),
    customerPurchasedProduct(scope, customerId, productHandle, productId),
    getCustomerReviewForProduct(db, productId, customerId)
  ])

  const isAdmin = isStoreAdminEmail(email)

  return {
    is_admin: isAdmin,
    purchased,
    can_review: isAdmin || purchased,
    has_review: Boolean(existingReview),
    existing_review: existingReview ? mapReviewRow(existingReview) : null
  }
}

export function normalizeRating(value: unknown): number | null {
  const rating = Number(value)
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null
  return Math.round(rating)
}

export function normalizeBody(value: unknown): string | null {
  const body = String(value || "").trim()
  if (body.length < 10 || body.length > 2000) return null
  return body
}

export function normalizeAuthorName(value: unknown): string | null {
  const name = String(value || "").trim()
  if (name.length < 2 || name.length > 80) return null
  return name
}
