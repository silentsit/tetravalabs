import { Star } from "lucide-react"
import { HOMEPAGE_TESTIMONIALS } from "@/lib/homepage-testimonials"

export function HomepageTestimonials() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {HOMEPAGE_TESTIMONIALS.map((review) => (
        <blockquote
          key={`${review.name}-${review.institution}`}
          className="rounded-xl border border-[#E2E8F0] bg-white p-6"
        >
          <div className="mb-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
            {Array.from({ length: review.rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" aria-hidden="true" />
            ))}
          </div>
          <p className="mb-4 text-sm italic leading-relaxed text-[#0F172A]">&ldquo;{review.text}&rdquo;</p>
          <footer>
            <p className="text-sm font-medium text-[#0F172A]">{review.name}</p>
            <p className="text-xs text-[#94A3B8]">{review.institution}</p>
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
