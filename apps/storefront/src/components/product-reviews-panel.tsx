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
import { getProductHref } from "@/lib/compound-product"

type Props = {
  productId: string
  productHandle: string
  initialData: ProductReviewsResponse
  /** quotes = published reviews under COA. form = write box in the Reviews tab. */
  mode?: "quotes" | "form"
  onReviewsChange?: (data: ProductReviewsResponse) => void
}

function localDateInputValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatReviewDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC"
  })
}

function newestFirst(items: ProductReview[]) {
  return [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function ProductReviewsPanel({
  productId,
  productHandle,
  initialData,
  mode = "form",
  onReviewsChange
}: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>(initialData.items)
  const [aggregate, setAggregate] = useState(initialData.aggregate)
  const [viewer, setViewer] = useState<ReviewViewerContext | null>(initialData.viewer)
  const [rating, setRating] = useState(5)
  const [body, setBody] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [reviewDate, setReviewDate] = useState(() => localDateInputValue())
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setReviews(initialData.items)
    setAggregate(initialData.aggregate)
    setViewer(initialData.viewer)
  }, [initialData])

  useEffect(() => {
    void (async () => {
      const customer = await retrieveCustomer()
      setSignedIn(Boolean(customer))
      setIsAdmin(isStoreAdminEmail(customer?.email))

      // Quotes stay on the SSR snapshot. A failed browser fetch to Medusa
      // used to replace them with an empty list and make the card vanish.
      if (mode === "quotes") return

      const authToken = readAuthToken()
      const fresh = await listProductReviews({
        productHandle,
        productId,
        authToken
      })
      if (!fresh) return
      setViewer(fresh.viewer)
      if (fresh.viewer?.existing_review && !isStoreAdminEmail(customer?.email)) {
        setRating(fresh.viewer.existing_review.rating)
        setBody(fresh.viewer.existing_review.body)
      }
    })()
  }, [productHandle, productId, mode])

  const applyReviews = (fresh: ProductReviewsResponse) => {
    setReviews(fresh.items)
    setAggregate(fresh.aggregate)
    setViewer(fresh.viewer)
    onReviewsChange?.(fresh)
  }

  const resetAdminForm = () => {
    setRating(5)
    setBody("")
    setAuthorName("")
    setReviewDate(localDateInputValue())
  }

  const refreshReviews = async () => {
    const authToken = readAuthToken()
    const fresh = await listProductReviews({ productHandle, productId, authToken })
    if (!fresh) return
    applyReviews(fresh)
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
        createdAt: postingAsAdmin ? reviewDate : undefined,
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

  if (mode === "quotes") {
    if (reviews.length === 0) return null
    const ordered = newestFirst(reviews)

    return (
      <section
        id="reviews"
        aria-label="Customer reviews"
        className="card mt-8 flex h-full min-h-0 scroll-mt-24 flex-col space-y-3 p-4 lg:mt-0"
      >
        <header className="shrink-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">
            Lab reviews
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <h2 className="font-serif text-lg text-[#0F172A]">Customer reviews</h2>
            <p className="shrink-0 font-mono text-xs text-[#0D9488]">
              {aggregate.ratingValue.toFixed(1)} · {aggregate.reviewCount}
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StarRating value={Math.round(aggregate.ratingValue)} readOnly size="sm" />
            <span className="text-xs text-[#64748B]">
              {aggregate.reviewCount} {aggregate.reviewCount === 1 ? "review" : "reviews"}
            </span>
          </div>
        </header>

        {aggregate.reviewCount > PRODUCT_REVIEWS_DISPLAY_LIMIT ? (
          <p className="text-xs text-[#64748B]">
            Showing the {PRODUCT_REVIEWS_DISPLAY_LIMIT} newest of {aggregate.reviewCount} reviews
          </p>
        ) : null}

        <ul className="min-h-0 flex-1 divide-y divide-[#E2E8F0] overflow-y-auto pr-1">
          {ordered.map((review) => (
            <li key={review.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#0F172A]">{review.author_name}</p>
                  <p className="mt-0.5 text-xs text-[#94A3B8]">
                    {formatReviewDate(review.created_at)}
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
              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-[#475569]">{review.body}</p>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-xl text-[#0F172A]">Write a review</h3>
        <p className="mt-2 text-sm text-[#475569]">
          Reviews are limited to verified purchasers. Published reviews appear next to the COA.
        </p>
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
            Admins can post unlimited reviews with any display name and date on any product.
          </p>
        ) : signedIn === false ? (
          <p className="text-xs text-[#64748B]">
            <Link
              href={`/login?returnUrl=${encodeURIComponent(getProductHref(productHandle))}`}
              className="text-[#0D9488] hover:underline"
            >
              Sign in
            </Link>{" "}
            before submitting. Reviews are limited to verified purchasers.
          </p>
        ) : null}
        {adminAccess ? (
          <>
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
            <div>
              <label className="block text-xs text-[#475569]">Review date (admin)</label>
              <input
                required
                type="date"
                value={reviewDate}
                max={localDateInputValue()}
                onChange={(event) => setReviewDate(event.target.value)}
                className="input-field mt-1"
              />
            </div>
          </>
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
    </div>
  )
}
