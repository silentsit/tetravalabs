import Link from "next/link"
import { listProducts } from "@/lib/medusa"
import { groupProductsByCategory } from "@/lib/categories"
import { categoryArtForSlug } from "@/lib/revamp/category-art"

export const revalidate = 300

export default async function CategoriesPage() {
  const products = await listProducts()
  const categories = groupProductsByCategory(products)

  return (
    <section className="page-container space-y-8 py-8">
      <div>
        <span className="section-label">Browse</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A]">Product categories</h1>
        <p className="mt-4 max-w-2xl text-[#475569]">
          Explore the live catalog grouped by compound class and application area.
        </p>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-[#475569]">No categories yet. Import the catalog into Medusa first.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => {
            const art = categoryArtForSlug(category.slug, category.name)
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="card card-hover group overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#F8FAFC]">
                  <img
                    src={art.image}
                    alt={category.name}
                    className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="font-mono text-xs text-[#0D9488]">{category.count} products</p>
                  <h2 className="mt-2 font-serif text-2xl text-[#0F172A] group-hover:text-[#0D9488]">
                    {category.name}
                  </h2>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      <div className="text-center">
        <Link href="/shop" className="btn-primary inline-flex px-8 py-3">
          View all products
        </Link>
      </div>
    </section>
  )
}
