import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { ProductCard } from "@/components/product-card"

type Props = {
  products: StoreProduct[]
  categoryHref: string
  categoryLabel: string
}

export function YouMayAlsoLike({ products, categoryHref, categoryLabel }: Props) {
  if (products.length === 0) return null

  return (
    <section
      aria-labelledby="you-may-also-like-heading"
      className="scroll-mt-28 border-t border-[#E2E8F0] pt-10"
    >
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <span className="section-label">Related</span>
          <h2 id="you-may-also-like-heading" className="mt-2 font-serif text-2xl text-[#0F172A] sm:text-3xl">
            You may also like
          </h2>
        </div>
        <Link
          href={categoryHref}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E] sm:flex"
        >
          {categoryLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="featured" />
        ))}
      </div>
    </section>
  )
}
