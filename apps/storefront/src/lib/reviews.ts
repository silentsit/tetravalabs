const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const PRODUCT_REVIEWS_DISPLAY_LIMIT = 6

export type ProductReview = {
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

export type ReviewViewerContext = {
  is_admin: boolean
  purchased: boolean
  can_review: boolean
  has_review: boolean
  existing_review: ProductReview | null
}

export type ProductReviewsResponse = {
  product_handle: string
  count: number
  aggregate: ReviewAggregate
  items: ProductReview[]
  viewer: ReviewViewerContext | null
}

function withHeaders(headers: HeadersInit = {}, authToken?: string | null) {
  return {
    ...headers,
    ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
    ...(authToken ? { authorization: `Bearer ${authToken}` } : {})
  }
}

export async function listProductReviews(input: {
  productHandle: string
  productId?: string
  authToken?: string | null
  limit?: number
}): Promise<ProductReviewsResponse> {
  const params = new URLSearchParams({
    product_handle: input.productHandle,
    limit: String(input.limit ?? PRODUCT_REVIEWS_DISPLAY_LIMIT)
  })
  if (input.productId) params.set("product_id", input.productId)

  try {
    const response = await fetch(`${MEDUSA_URL}/store/reviews?${params.toString()}`, {
      headers: withHeaders({}, input.authToken),
      next: input.authToken ? undefined : { revalidate: 60, tags: [`reviews:${input.productHandle}`] }
    })
    if (!response.ok) throw new Error("Failed reviews request")
    return (await response.json()) as ProductReviewsResponse
  } catch {
    return {
      product_handle: input.productHandle,
      count: 0,
      aggregate: { ratingValue: 0, reviewCount: 0 },
      items: [],
      viewer: null
    }
  }
}

export async function submitProductReview(input: {
  productId: string
  productHandle: string
  rating: number
  body: string
  authorName?: string
  authToken: string
}) {
  const response = await fetch(`${MEDUSA_URL}/store/reviews`, {
    method: "POST",
    headers: withHeaders({ "content-type": "application/json" }, input.authToken),
    body: JSON.stringify({
      product_id: input.productId,
      product_handle: input.productHandle,
      rating: input.rating,
      body: input.body,
      author_name: input.authorName
    })
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || "Could not submit review.")
  }

  return data.review as ProductReview
}

export async function deleteProductReview(input: { reviewId: string; authToken: string }) {
  const response = await fetch(`${MEDUSA_URL}/store/reviews/${encodeURIComponent(input.reviewId)}`, {
    method: "DELETE",
    headers: withHeaders({}, input.authToken)
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || "Could not delete review.")
  }

  return true
}
