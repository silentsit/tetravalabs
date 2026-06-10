import Link from "next/link"
import { groupProductsByCategory } from "@/lib/categories"
import { listProducts } from "@/lib/medusa"

export async function FeaturedCategories() {
  const products = await listProducts()
  const categories = groupProductsByCategory(products).slice(0, 6)

  if (categories.length === 0) return null

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Browse</p>
          <h2 className="mt-2 font-serif text-3xl text-[#E8E8F0]">Research Categories</h2>
          <p className="mt-2 text-[#8A8AA0]">Explore compounds grouped by research application.</p>
        </div>
        <Link href="/categories" className="text-sm text-[#5EEAD4] hover:underline">
          All categories
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5 transition hover:border-[#5EEAD4]/30"
          >
            <p className="font-medium text-[#E8E8F0] group-hover:text-[#5EEAD4]">{category.name}</p>
            <p className="mt-2 text-sm text-[#8A8AA0]">
              {category.count} {category.count === 1 ? "product" : "products"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
