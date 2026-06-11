import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { ProductCard } from "@/components/product-card"

export async function FeaturedProducts() {
  const products = await listProducts()
  const featured = products.slice(0, 8)

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Featured</p>
          <h2 className="mt-2 font-serif text-3xl text-[#E8E8F0]">Most Requested</h2>
          <p className="mt-2 text-[#8A8AA0]">Live catalog from Medusa</p>
        </div>
        <Link href="/shop" className="hidden text-sm text-[#5EEAD4] sm:inline">
          View all
        </Link>
      </div>
      {featured.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">
          No products loaded yet. Start Medusa and run catalog import.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
