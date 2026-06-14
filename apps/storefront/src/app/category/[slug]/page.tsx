import type { Metadata } from "next"
import { listProducts } from "@/lib/medusa"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { categoryLabelFromSlug, filterProductsByCategorySlug } from "@/lib/categories"
import { getCategorySeoBlock } from "@/lib/sanity"
import { buildPageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const products = await listProducts()
  const label = categoryLabelFromSlug(slug, products)
  const seo = await getCategorySeoBlock(slug)
  return buildPageMetadata({
    title: seo?.seoTitle || `${label} — research peptides`,
    description:
      seo?.seoDescription ||
      `Shop ${label} research compounds with HPLC-MS verification and lot-linked COAs.`,
    path: `/category/${slug}`
  })
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const products = await listProducts()
  const filtered = filterProductsByCategorySlug(products, slug)
  const label = categoryLabelFromSlug(slug, products)
  const seo = await getCategorySeoBlock(slug)

  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: label }
        ]}
      />
      <div>
        <span className="section-label">Category</span>
        <h1 className="mt-2 break-words font-serif text-3xl text-[#0F172A] sm:text-4xl">{label}</h1>
        {seo?.introCopy ? (
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#475569]">{seo.introCopy}</p>
        ) : (
          <p className="mt-2 text-sm text-[#475569]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} in this category.
          </p>
        )}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-[#475569]">No products in this category yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {seo?.supportingCopy ? (
        <section className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-sm leading-relaxed text-[#475569]">
          {seo.supportingCopy}
        </section>
      ) : null}
    </section>
  )
}
