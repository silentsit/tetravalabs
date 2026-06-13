export const revalidate = 300

import type { Metadata } from "next"
import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryList } from "@/components/coa-library-list"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "COA library — batch certificates",
  description:
    "Search lot-linked Certificates of Analysis (COA) and HPLC documents for Tetrava Labs research peptides.",
  path: "/coa-library"
})

export default async function CoaLibraryPage() {
  const docs = await listRecentCoas(250)
  return <CoaLibraryList documents={docs} />
}
