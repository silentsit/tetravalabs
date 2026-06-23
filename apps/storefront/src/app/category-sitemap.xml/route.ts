import { getCategorySitemapEntries, renderUrlSet, xmlResponse } from "@/lib/sitemap-xml"

export const revalidate = 3600

export async function GET() {
  const entries = await getCategorySitemapEntries()
  return xmlResponse(renderUrlSet(entries))
}
