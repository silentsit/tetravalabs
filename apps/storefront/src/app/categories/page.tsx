import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { groupProductsByCategory } from "@/lib/categories"

export const revalidate = 300

export default async function CategoriesPage() {
  const products = await listProducts()
  const categories = groupProductsByCategory(products)

  return (
    <section className="space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Browse</p>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0]">Product Categories</h1>
        <p className="mt-4 max-w-2xl text-[#8A8AA0]">
          Explore the live Medusa catalog grouped by compound class and application area.
        </p>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">No categories yet. Import the catalog into Medusa first.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 transition hover:-translate-y-0.5 hover:border-[rgba(120,160,220,0.3)]"
            >
              <p className="font-mono text-xs text-[#5EEAD4]">{category.count} products</p>
              <h2 className="mt-3 font-serif text-2xl text-[#E8E8F0] group-hover:text-[#5EEAD4]">
                {category.name}
              </h2>
              <p className="mt-4 text-sm text-[#5EEAD4]">Browse category →</p>
            </Link>
          ))}
        </div>
      )}
      <div className="text-center">
        <Link href="/shop" className="inline-block rounded-lg bg-[#5EEAD4] px-8 py-3 text-sm font-medium text-[#050508]">
          View All Products
        </Link>
      </div>
    </section>
  )
}
