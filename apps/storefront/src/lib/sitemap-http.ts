import {
  getSitemapEntriesById,
  getSitemapIndexEntries,
  renderSitemapIndex,
  renderSitemapUrlSet,
  xmlResponse
} from "@/lib/sitemap-entries"

export const revalidate = 3600

export async function respondWithSitemapIndex() {
  const entries = await getSitemapIndexEntries()
  return xmlResponse(renderSitemapIndex(entries))
}

export async function respondWithSitemapId(id: string) {
  const entries = await getSitemapEntriesById(id)
  return xmlResponse(renderSitemapUrlSet(entries))
}
