import { Suspense } from "react"
import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ShopCatalog, ShopCatalogFallback } from "@/components/shop-catalog"
import { listProducts } from "@/lib/medusa"
import { shopNavLabel } from "@/lib/shop-filters"
import { buildPageMetadata } from "@/lib/seo"

export const revalidate = 300

export const metadata: Metadata = buildPageMetadata({
  title: "Research Peptides for Sale",
  description:
    "Browse the full Tetrava Labs catalog — GLP-1 peptides, tissue repair compounds, growth secretagogues, and lab supplies with batch COAs.",
  path: "/shop",
  pageType: "CollectionPage"
})

export default async function ShopPage() {
  const products = await listProducts()

  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: shopNavLabel }]} />
      <Suspense fallback={<ShopCatalogFallback products={products} />}>
        <ShopCatalog products={products} />
      </Suspense>
    </section>
  )
}
