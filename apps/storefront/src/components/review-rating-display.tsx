import { StarRating } from "@/components/star-rating"

type Props = {
  rating: number
  size?: "sm" | "md"
}

export function ReviewRatingDisplay({ rating, size = "md" }: Props) {
  if (rating > 5) {
    return (
      <span className={`font-medium text-[#F59E0B] ${size === "sm" ? "text-xs" : "text-sm"}`}>
        {rating} ★
      </span>
    )
  }

  return <StarRating value={rating} readOnly size={size} />
}
