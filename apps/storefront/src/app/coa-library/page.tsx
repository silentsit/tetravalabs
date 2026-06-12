export const revalidate = 300

import { listRecentCoas } from "@/lib/medusa"
import { CoaLibraryList } from "@/components/coa-library-list"

export default async function CoaLibraryPage() {
  const docs = await listRecentCoas(100)
  return <CoaLibraryList documents={docs} />
}
