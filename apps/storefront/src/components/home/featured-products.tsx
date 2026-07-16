import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { StoreProduct } from "@/lib/medusa"
import { ProductCard } from "@/components/product-card"
import { FEATURED_PRODUCT_HANDLES } from "@/lib/product-image-map"

type Props = {
  products: StoreProduct[]
}

export function FeaturedProducts({ products }: Props) {
  const byHandle = new Map(products.map((product) => [product.handle, product]))
  const featured = FEATURED_PRODUCT_HANDLES.map((handle) => byHandle.get(handle))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .slice(0, 4)

  return (
    <>
      <div className="mb-10 flex items-end justify-between">
        <div>
          <span className="section-label">Popular</span>
          <h2 className="mt-2 font-serif text-3xl text-[#0F172A]">Best Selling Products</h2>
          <p className="mt-2 text-[#475569]">Frequently reordered by research institutions</p>
        </div>
        <Link
          href="/shop"
          className="hidden items-center gap-1 text-sm font-medium text-[#0D9488] hover:text-[#0F766E] sm:flex"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {featured.length === 0 ? (
        <p className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#475569]">
          Catalog is loading from Medusa. If this persists, check NEXT_PUBLIC_MEDUSA_URL in
          .env.local.
        </p>
      ) : (
        <div className="product-card-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} variant="featured" />
          ))}
        </div>
      )}
    </>
  )
}
