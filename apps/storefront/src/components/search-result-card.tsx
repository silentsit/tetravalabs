import Link from "next/link"
import type { SearchResult } from "@/lib/search"

type Props = {
  result: SearchResult
}

export function SearchResultCard({ result }: Props) {
  const priceLabel =
    result.price_min === result.price_max
      ? `$${(result.price_min / 100).toFixed(2)}`
      : `$${(result.price_min / 100).toFixed(2)} – $${(result.price_max / 100).toFixed(2)}`

  return (
    <Link
      href={`/product/${result.handle}`}
      className="group flex flex-col rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5 transition hover:border-[#5EEAD4]/30"
    >
      <p className="font-mono text-[10px] uppercase tracking-wide text-[#5EEAD4]">{result.category}</p>
      <h2 className="mt-2 font-serif text-lg text-[#E8E8F0] transition group-hover:text-[#5EEAD4]">
        {result.title}
      </h2>
      <p className="mt-1 text-xs capitalize text-[#8A8AA0]">{result.visual_type}</p>
      <p className="mt-auto pt-4 text-sm font-medium text-[#E8E8F0]">{priceLabel}</p>
    </Link>
  )
}
