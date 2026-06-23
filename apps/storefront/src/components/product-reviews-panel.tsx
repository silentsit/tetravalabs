"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import type {
  ProductReview,
  ProductReviewsResponse,
  ReviewViewerContext
} from "@/lib/reviews"
import { deleteProductReview, listProductReviews, submitProductReview } from "@/lib/reviews"
import { isStoreAdminEmail } from "@/lib/admin-access"
import { readAuthToken, retrieveCustomer } from "@/lib/medusa-auth"
import { StarRating } from "@/components/star-rating"

type Props = {
  productId: string
  productHandle: string
  initialData: ProductReviewsResponse
}

export function ProductReviewsPanel({ productId, productHandle, initialData }: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialData.items)
  const [aggregate, setAggregate] = useState(initialData.aggregate)
  const [viewer, setViewer] = useState<ReviewViewerContext | null>(initialData.viewer)
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    void (async () => {
      const customer = await retrieveCustomer()
      setSignedIn(Boolean(customer))
      setIsAdmin(isStoreAdminEmail(customer?.email))

      const authToken = readAuthToken()
      const fresh = await listProductReviews({
        productHandle,
        productId,
        authToken
      })
      setReviews(fresh.items)
      setAggregate(fresh.aggregate)
      setViewer(fresh.viewer)
      if (fresh.viewer?.existing_review) {
        setRating(fresh.viewer.existing_review.rating)
        setBody(fresh.viewer.existing_review.body)
        if (isStoreAdminEmail(customer?.email)) {
          setAuthorName(fresh.viewer.existing_review.author_name)
        }
      }
    })()
  }, [productHandle, productId])

  const refreshReviews = async () => {
    const authToken = readAuthToken()
    const fresh = await listProductReviews({ productHandle, productId, authToken })
    setReviews(fresh.items)
    setAggregate(fresh.aggregate)
    setViewer(fresh.viewer)
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")
    setStatus("")
    setSubmitting(true)

    try {
      const authToken = readAuthToken()
      if (!authToken) {
        setError("Sign in to leave a review.")
        return
      }

      await submitProductReview({
        productId,
        productHandle,
        rating,
        body,
        authorName: isAdmin ? authorName : undefined,
        authToken
      })

      setStatus(viewer?.has_review ? "Review updated." : "Review submitted. Thank you.")
      await refreshReviews()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not submit review.")
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (reviewId: string) => {
    setError("")
    setStatus("")
    try {
      const authToken = readAuthToken()
      if (!authToken) return
      await deleteProductReview({ reviewId, authToken })
      setStatus("Review deleted.")
      await refreshReviews()
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete review.")
    }
  }

  const showForm = signedIn && viewer?.can_review

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-[#0F172A]">Customer Reviews</h3>
          {aggregate.reviewCount > 0 ? (
            <div className="mt-2 flex items-center gap-3">
              <StarRating value={Math.round(aggregate.ratingValue)} readOnly />
              <p className="text-sm text-[#475569]">
                {aggregate.ratingValue.toFixed(1)} · {aggregate.reviewCount}{" "}
                {aggregate.reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#475569]">No reviews yet for this product.</p>
          )}
        </div>
      </div>

      {showForm ? (
        <form onSubmit={onSubmit} className="card space-y-4 p-5">
          <p className="text-sm font-medium text-[#0F172A]">
            {viewer?.has_review ? "Update your review" : "Share your experience"}
          </p>
          {isAdmin ? (
            <div>
              <label className="block text-xs text-[#475569]">Display name (admin)</label>
              <input
                required
                value={authorName}
                onChange={(event) => setAuthorName(event.target.value)}
                className="input-field mt-1"
                placeholder="Custom reviewer name"
              />
            </div>
          ) : null}
          <div>
            <label className="block text-xs text-[#475569]">Rating</label>
            <div className="mt-2">
              <StarRating value={rating} onChange={setRating} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#475569]">Review</label>
            <textarea
              required
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              minLength={10}
              maxLength={2000}
              className="input-field mt-1 min-h-28"
              placeholder="Describe product quality, packaging, or lab results."
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
            {submitting ? "Saving..." : viewer?.has_review ? "Update review" : "Submit review"}
          </button>
          {status ? <p className="text-xs text-[#0D9488]">{status}</p> : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </form>
      ) : signedIn === false ? (
        <p className="text-sm text-[#475569]">
          <Link href={`/login?returnUrl=/product/${productHandle}`} className="text-[#0D9488] hover:underline">
            Sign in
          </Link>{" "}
          to leave a review after purchasing this product.
        </p>
      ) : signedIn && viewer && !viewer.can_review ? (
        <p className="text-sm text-[#475569]">
          Verified purchasers can review this product once. Place an order to unlock review access.
        </p>
      ) : null}

      {reviews.length > 0 ? (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#0F172A]">{review.author_name}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={review.rating} readOnly size="sm" />
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => void onDelete(review.id)}
                      className="rounded p-1 text-[#94A3B8] transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{review.body}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
