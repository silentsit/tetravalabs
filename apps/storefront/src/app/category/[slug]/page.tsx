import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { ProductCard } from "@/components/product-card"
import { categoryLabelFromSlug, filterProductsByCategorySlug } from "@/lib/categories"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const products = await listProducts()
  const filtered = filterProductsByCategorySlug(products, slug)
  const label = categoryLabelFromSlug(slug, products)

  return (
    <section className="space-y-6">
      <div>
        <Link href="/categories" className="text-xs text-[#5EEAD4]">
          ← All categories
        </Link>
        <h1 className="mt-3 text-3xl font-semibold">{label}</h1>
        <p className="text-[#8A8AA0]">{filtered.length} products in this category.</p>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">No products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
