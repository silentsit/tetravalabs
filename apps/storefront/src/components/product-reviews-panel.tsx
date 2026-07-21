"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { Trash2 } from "lucide-react"
import type {
  ProductReview,
  ProductReviewsResponse,
  ReviewViewerContext
} from "@/lib/reviews"
import { deleteProductReview, listProductReviews, PRODUCT_REVIEWS_DISPLAY_LIMIT, submitProductReview } from "@/lib/reviews"
import { isStoreAdminEmail } from "@/lib/admin-access"
import { readAuthToken, retrieveCustomer } from "@/lib/medusa-auth"
import { StarRating } from "@/components/star-rating"
import { ReviewRatingDisplay } from "@/components/review-rating-display"

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
      if (fresh.viewer?.existing_review && !isStoreAdminEmail(customer?.email)) {
        setRating(fresh.viewer.existing_review.rating)
        setBody(fresh.viewer.existing_review.body)
      }
    })()
  }, [productHandle, productId])

  const resetAdminForm = () => {
    setRating(5)
    setBody("")
    setAuthorName("")
  }

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

    const ineligibleMessage = "Only accounts that have purchased this product before can post a review."

    try {
      const authToken = readAuthToken()
      if (!authToken) {
        setError("Sign in to leave a review.")
        return
      }

      const postingAsAdmin = isAdmin || Boolean(viewer?.is_admin)
      if (!postingAsAdmin && viewer && !viewer.can_review) {
        setError(ineligibleMessage)
        return
      }

      await submitProductReview({
        productId,
        productHandle,
        rating,
        body,
        authorName: postingAsAdmin ? authorName : undefined,
        authToken
      })

      if (postingAsAdmin) {
        setStatus("Review posted.")
        resetAdminForm()
      } else {
        setStatus(viewer?.has_review ? "Review updated." : "Review submitted. Thank you.")
      }
      await refreshReviews()
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Could not submit review."
      if (/only verified purchasers|not eligible|purchase/i.test(message)) {
        setError(ineligibleMessage)
      } else {
        setError(message)
      }
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

  const adminAccess = isAdmin || Boolean(viewer?.is_admin)

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

      <form onSubmit={onSubmit} className="card max-w-md space-y-3 p-4">
        <p className="text-sm font-medium text-[#0F172A]">
          {adminAccess
            ? "Post a review (admin)"
            : viewer?.has_review
              ? "Update your review"
              : "Share your experience"}
        </p>
        {adminAccess ? (
          <p className="text-xs text-[#64748B]">
            Admins can post unlimited reviews with any display name on any product.
          </p>
        ) : signedIn === false ? (
          <p className="text-xs text-[#64748B]">
            <Link href={`/login?returnUrl=/product/${productHandle}`} className="text-[#0D9488] hover:underline">
              Sign in
            </Link>{" "}
            before submitting. Reviews are limited to verified purchasers.
          </p>
        ) : null}
        {adminAccess ? (
          <div>
            <label className="block text-xs text-[#475569]">Display name (admin)</label>
            <input
              required
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              className="input-field mt-1"
              placeholder="Any custom reviewer name"
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
            rows={3}
            minLength={adminAccess ? undefined : 10}
            maxLength={adminAccess ? undefined : 2000}
            className="input-field mt-1 min-h-20"
            placeholder={
              adminAccess
                ? "Admin review — no character limit."
                : "Describe product quality, packaging, or lab results."
            }
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting
            ? "Saving..."
            : adminAccess
              ? "Post review"
              : viewer?.has_review
                ? "Update review"
                : "Submit review"}
        </button>
        {status ? <p className="text-xs text-[#0D9488]">{status}</p> : null}
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </form>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {aggregate.reviewCount > PRODUCT_REVIEWS_DISPLAY_LIMIT ? (
            <p className="text-xs text-[#64748B]">
              Showing latest {PRODUCT_REVIEWS_DISPLAY_LIMIT} of {aggregate.reviewCount} reviews
            </p>
          ) : null}
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#0F172A]">{review.author_name}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {new Date(review.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <ReviewRatingDisplay rating={review.rating} size="sm" />
                  {adminAccess ? (
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
              <p className="mt-3 line-clamp-6 flex-1 text-sm leading-relaxed text-[#475569]">{review.body}</p>
            </li>
          ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
