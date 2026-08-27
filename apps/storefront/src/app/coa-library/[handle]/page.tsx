export const revalidate = 300

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryProductDetail } from "@/components/coa-library-product-detail"
import { PageJsonLd } from "@/components/page-json-ld"
import {
  coaLibraryProductPath,
  findCoaLibraryProduct,
  groupCoasByProduct
} from "@/lib/coa-library"
import { buildPageMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ handle: string }>
}

async function loadProduct(handle: string) {
  const docs = await listRecentCoas(500)
  const products = groupCoasByProduct(docs)
  return findCoaLibraryProduct(products, decodeURIComponent(handle))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await loadProduct(handle)
  if (!product) {
    return buildPageMetadata({
      title: "COA not found",
      path: coaLibraryProductPath(handle),
      noIndex: true
    })
  }

  return buildPageMetadata({
    title: `${product.displayName} — COA documents`,
    description: `Lot-linked Certificates of Analysis for ${product.displayName}. ${product.documentCount} research document${product.documentCount === 1 ? "" : "s"} available.`,
    path: coaLibraryProductPath(product.parentHandle),
    ogTitle: product.displayName,
    ogEyebrow: "COA library",
    ogKicker: `${product.documentCount} lot-linked certificate${product.documentCount === 1 ? "" : "s"}`,
    image: product.image
  })
}

export default async function CoaLibraryProductPage({ params }: Props) {
  const { handle } = await params
  const product = await loadProduct(handle)
  if (!product) notFound()

  return (
    <>
      <PageJsonLd pathname={coaLibraryProductPath(product.parentHandle)} />
      <CoaLibraryProductDetail product={product} />
    </>
  )
}
