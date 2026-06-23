import { getSitemapIndexEntries, renderSitemapIndex, xmlResponse } from "@/lib/sitemap-xml"

export const revalidate = 3600

export async function GET() {
  const entries = await getSitemapIndexEntries()
  return xmlResponse(renderSitemapIndex(entries))
}
