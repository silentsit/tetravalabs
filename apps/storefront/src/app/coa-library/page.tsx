export const revalidate = 300

import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryList } from "@/components/coa-library-list"
import {
  coaLibraryProductPath,
  findCoaLibraryProduct,
  groupCoasByProduct
} from "@/lib/coa-library"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "COA library — batch certificates",
  description:
    "Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptides.",
  path: "/coa-library",
  pageType: "CollectionPage"
})

type Props = {
  searchParams: Promise<{ product?: string }>
}

export default async function CoaLibraryPage({ searchParams }: Props) {
  const params = await searchParams
  const docs = await listRecentCoas(500)
  const products = groupCoasByProduct(docs)

  const productParam = params.product?.trim()
  if (productParam) {
    const match = findCoaLibraryProduct(products, productParam)
    if (match) redirect(coaLibraryProductPath(match.parentHandle))
  }

  return <CoaLibraryList products={products} />
}
