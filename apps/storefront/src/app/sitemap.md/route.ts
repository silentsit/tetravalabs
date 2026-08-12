import { NextResponse } from "next/server"
import {
  getAllProductSitemapEntries,
  getCategorySitemapEntries,
  getPageSitemapEntries,
  getPostSitemapEntries,
  getSitemapBaseUrl,
  SITEMAP_REVALIDATE_SECONDS,
  type SitemapUrlEntry
} from "@/lib/sitemap-entries"

export const revalidate = 3600

function pathFromLoc(baseUrl: string, loc: string): string {
  return loc.startsWith(baseUrl) ? loc.slice(baseUrl.length) || "/" : loc
}

function renderLinks(baseUrl: string, entries: SitemapUrlEntry[]): string {
  return entries
    .map((entry) => {
      const path = pathFromLoc(baseUrl, entry.loc)
      const label = path === "/" ? "Home" : path.replace(/^\//, "").replace(/[-/]/g, " ")
      return `- [${label}](${path})`
    })
    .join("\n")
}

export async function GET() {
  const baseUrl = getSitemapBaseUrl()
  const [pages, posts, products, categories] = await Promise.all([
    getPageSitemapEntries(),
    getPostSitemapEntries(),
    getAllProductSitemapEntries(),
    getCategorySitemapEntries()
  ])

  const body = `# Sitemap

## Pages
${renderLinks(baseUrl, pages)}

## Categories
${renderLinks(baseUrl, categories)}

## Products
${renderLinks(baseUrl, products)}

## Research Hub (Blog)
${renderLinks(baseUrl, posts)}
`

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${SITEMAP_REVALIDATE_SECONDS}, stale-while-revalidate=86400`
    }
  })
}
