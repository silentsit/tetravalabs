export const revalidate = 300

import { Suspense } from "react"
import type { Metadata } from "next"
import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryList } from "@/components/coa-library-list"
import { CoaLibraryProductRedirect } from "@/components/coa-library-product-redirect"
import { groupCoasByProduct } from "@/lib/coa-library"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "COA library — batch certificates",
  description:
    "Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptides.",
  path: "/coa-library",
  pageType: "CollectionPage"
})

export default async function CoaLibraryPage() {
  const docs = await listRecentCoas(500)
  const products = groupCoasByProduct(docs)

  return (
    <>
      <Suspense fallback={null}>
        <CoaLibraryProductRedirect products={products} />
      </Suspense>
      <CoaLibraryList products={products} />
    </>
  )
}
