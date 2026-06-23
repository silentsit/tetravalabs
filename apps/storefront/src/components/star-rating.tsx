import { Star } from "lucide-react"

type Props = {
  value: number
  onChange?: (value: number) => void
  size?: "sm" | "md"
  readOnly?: boolean
}

export function StarRating({ value, onChange, size = "md", readOnly = false }: Props) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value
        const sharedClass = `${iconClass} ${active ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#CBD5E1]"}`

        if (readOnly || !onChange) {
          return <Star key={star} className={sharedClass} aria-hidden />
        }

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded p-0.5 transition hover:scale-105"
            aria-label={`Rate ${star} stars`}
          >
            <Star className={sharedClass} aria-hidden />
          </button>
        )
      })}
    </div>
  )
}
