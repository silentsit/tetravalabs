import { respondWithSitemapIndex } from "@/lib/sitemap-http"

export const revalidate = 3600

export async function GET() {
  return respondWithSitemapIndex()
}
