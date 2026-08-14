import { respondWithSitemapIndex } from "@/lib/sitemap-http"

export const revalidate = 3600

/** Standard sitemap endpoint; returns XML directly rather than redirecting crawlers. */
export async function GET() {
  return respondWithSitemapIndex()
}
