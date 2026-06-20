import Link from "next/link"
import type { SearchResult } from "@/lib/search"
import { getProductImage } from "@/lib/product-image-map"

type Props = {
  result: SearchResult
}

export function SearchResultCard({ result }: Props) {
  const priceLabel =
    result.price_min === result.price_max
      ? `$${(result.price_min / 100).toFixed(2)}`
      : `$${(result.price_min / 100).toFixed(2)} – $${(result.price_max / 100).toFixed(2)}`

  const image = getProductImage(result.handle)

  return (
    <Link
      href={`/product/${result.handle}`}
      className="card card-hover group flex flex-col overflow-hidden"
    >
      <div className="product-card-media">
        <img
          src={image}
          alt={result.title}
          className="product-card-media-image"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col border-t border-[#E2E8F0] p-4">
        <p className="font-mono text-[10px] uppercase tracking-wide text-[#0D9488]">{result.category}</p>
        <h2 className="mt-2 font-serif text-lg text-[#0F172A] transition group-hover:text-[#0D9488]">
          {result.title}
        </h2>
        <p className="mt-auto pt-4 text-sm font-medium text-[#0F172A]">{priceLabel}</p>
      </div>
    </Link>
  )
}
