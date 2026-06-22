import Link from "next/link"
import type { SearchResult } from "@/lib/search"
import type { ShelfPriceDisplay } from "@/lib/pack-pricing"
import { getProductImage } from "@/lib/product-image-map"
import { ShelfPriceLabel } from "@/components/shelf-price-label"

type Props = {
  result: SearchResult
}

function shelfPriceFromSearchResult(result: SearchResult): ShelfPriceDisplay {
  if (result.unit_price_min != null) {
    const min = result.unit_price_min / 100
    const max = (result.unit_price_max ?? result.unit_price_min) / 100
    const unitAmount =
      min !== max ? `$${min.toFixed(2)} – $${max.toFixed(2)}` : `$${min.toFixed(2)}`
    const moqLabel = result.moq_qty ? `${result.moq_qty}-vial minimum` : null
    const packLabel =
      result.price_min > 0
        ? `packs from $${(result.price_min / 100).toFixed(2)}`
        : null
    const detail =
      moqLabel && packLabel ? `${moqLabel} · ${packLabel}` : moqLabel || packLabel

    return {
      unitAmount,
      unitSuffix: "/vial",
      detail,
      isPackProduct: true
    }
  }

  const min = result.price_min / 100
  const max = result.price_max / 100
  const unitAmount =
    min !== max ? `$${min.toFixed(2)} – $${max.toFixed(2)}` : `$${min.toFixed(2)}`

  return {
    unitAmount,
    unitSuffix: "",
    detail: null,
    isPackProduct: false
  }
}

export function SearchResultCard({ result }: Props) {
  const shelf = shelfPriceFromSearchResult(result)
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
        <div className="mt-auto pt-4">
          <ShelfPriceLabel shelf={shelf} variant="search" />
        </div>
      </div>
    </Link>
  )
}
