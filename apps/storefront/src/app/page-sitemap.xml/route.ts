import { getPageSitemapEntries, renderUrlSet, xmlResponse } from "@/lib/sitemap-xml"

export const revalidate = 3600

export async function GET() {
  const entries = await getPageSitemapEntries()
  return xmlResponse(renderUrlSet(entries))
}
