export const revalidate = 300

import type { Metadata } from "next"
import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryList } from "@/components/coa-library-list"
import { PageJsonLd } from "@/components/page-json-ld"
import { groupCoasByProduct } from "@/lib/coa-library"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "COA library — batch certificates",
  description:
    "Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptides.",
  path: "/coa-library",
  pageType: "CollectionPage",
  ogTitle: "COA library",
  ogEyebrow: "Certificates of Analysis",
  ogKicker: "Lot-linked HPLC-MS documents."
})

export default async function CoaLibraryPage() {
  const docs = await listRecentCoas(500)
  const products = groupCoasByProduct(docs)

  return (
    <>
      <PageJsonLd pathname="/coa-library" />
      <CoaLibraryList products={products} />
    </>
  )
}
