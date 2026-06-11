import { listProducts } from "@/lib/medusa"
import { Breadcrumbs } from "@/components/breadcrumbs"
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
    <section className="space-y-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: label }
        ]}
      />
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Category</p>
        <h1 className="mt-2 font-serif text-4xl text-[#E8E8F0]">{label}</h1>
        <p className="mt-2 text-sm text-[#8A8AA0]">
          {filtered.length} {filtered.length === 1 ? "product" : "products"} in this category.
        </p>
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
