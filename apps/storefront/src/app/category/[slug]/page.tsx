import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { listProducts } from "@/lib/medusa"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ProductCard } from "@/components/product-card"
import {
  CATEGORY_NAME_BY_SLUG,
  categoryLabelFromSlug,
  filterProductsByCategorySlug,
  isStorefrontCategorySlug,
  normalizeCategorySlug,
  STOREFRONT_CATEGORY_SLUGS,
  type StorefrontCategorySlug
} from "@/lib/categories"
import { getCategorySeoBlock } from "@/lib/sanity"
import { categoryArtForSlug } from "@/lib/revamp/category-art"
import { buildPageMetadata } from "@/lib/seo"
import { sortProducts } from "@/lib/sort-products"
import { PageJsonLd } from "@/components/page-json-ld"

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300
/** Legacy and unknown slugs 404. Canonical category URLs are the generateStaticParams list. */
export const dynamicParams = false

export function generateStaticParams() {
  return STOREFRONT_CATEGORY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const normalized = normalizeCategorySlug(slug)
  if (!isStorefrontCategorySlug(normalized) || normalized !== slug) {
    return buildPageMetadata({
      title: "Category Not Found",
      path: `/category/${slug}`,
      noIndex: true
    })
  }

  const products = await listProducts()
  const label = categoryLabelFromSlug(normalized, products)
  const seo = await getCategorySeoBlock(normalized)
  const art = categoryArtForSlug(normalized, label)
  return buildPageMetadata({
    title: seo?.seoTitle || `${label} | research peptides`,
    description:
      seo?.seoDescription ||
      art.description ||
      `Shop ${label} research peptides with verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).`,
    path: `/category/${normalized}`,
    ogTitle: label,
    ogEyebrow: "Research peptides",
    ogKicker: "99%+ HPLC-MS purity. Lot-linked COAs.",
    image: art.image,
    pageType: "CollectionPage"
  })
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const normalized = normalizeCategorySlug(slug)

  if (!isStorefrontCategorySlug(normalized) || normalized !== slug) {
    notFound()
  }

  const products = await listProducts()
  const filtered = sortProducts(filterProductsByCategorySlug(products, normalized), "featured")
  const label =
    CATEGORY_NAME_BY_SLUG[normalized as StorefrontCategorySlug] ||
    categoryLabelFromSlug(normalized, products)
  const seo = await getCategorySeoBlock(normalized)
  const art = categoryArtForSlug(normalized, label)
  const intro =
    seo?.introCopy ||
    art.description ||
    `${filtered.length} ${filtered.length === 1 ? "product" : "products"} in this category.`

  return (
    <section className="page-container space-y-8 py-8">
      <PageJsonLd pathname={`/category/${normalized}`} />
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
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#475569]">{intro}</p>
        {!seo?.introCopy ? (
          <p className="mt-2 text-sm text-[#64748B]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"} available.
          </p>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-[#475569]">No products in this category yet.</p>
      ) : (
        <div className="product-card-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {seo?.supportingCopy ? (
        <section className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-sm leading-relaxed text-[#475569]">
          {seo.supportingCopy}
        </section>
      ) : (
        <section className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-sm leading-relaxed text-[#475569]">
          All compounds ship for research use only (RUO) with lot-linked COA documentation. Browse the{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            COA Library
          </Link>{" "}
          before starting experiments.
        </section>
      )}
    </section>
  )
}
