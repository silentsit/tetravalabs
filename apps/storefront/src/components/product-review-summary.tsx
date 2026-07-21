import { StarRating } from "@/components/star-rating"
import type { ReviewAggregate } from "@/lib/reviews"

type Props = {
  aggregate: ReviewAggregate
}

export function ProductReviewSummary({ aggregate }: Props) {
  if (aggregate.reviewCount <= 0) return null

  const displayStars = Math.max(1, Math.min(5, Math.round(aggregate.ratingValue)))

  return (
    <a
      href="#reviews"
      className="mt-3 inline-flex flex-wrap items-center gap-2 text-sm text-[#475569] transition hover:text-[#0D9488]"
    >
      <StarRating value={displayStars} readOnly size="sm" />
      <span>
        {aggregate.ratingValue.toFixed(1)} · {aggregate.reviewCount}{" "}
        {aggregate.reviewCount === 1 ? "review" : "reviews"}
      </span>
      <span className="text-[#0D9488]">See reviews</span>
    </a>
  )
}
