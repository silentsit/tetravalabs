import { NextResponse } from "next/server"
import { getHtmlSitemapData, renderHtmlSitemapMarkdown } from "@/lib/html-sitemap"
import { SITEMAP_REVALIDATE_SECONDS } from "@/lib/sitemap-entries"

export const revalidate = 3600

export async function GET() {
  const data = await getHtmlSitemapData()
  const body = `# Sitemap\n\n${renderHtmlSitemapMarkdown(data)}\n`

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${SITEMAP_REVALIDATE_SECONDS}, stale-while-revalidate=86400`
    }
  })
}
