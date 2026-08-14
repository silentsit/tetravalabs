import { NextResponse } from "next/server"

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

const DISALLOW_PATHS = [
  "/checkout",
  "/account",
  "/orders",
  "/cart",
  "/login",
  "/register",
  "/search",
  "/api/",
  "/reorder"
]

/**
 * Allow search + AI crawlers the same public paths.
 * Private account/checkout routes stay disallowed.
 * Also confirm Cloudflare AI Crawl Control is not still blocking these bots at the edge.
 *
 * A route handler (not `MetadataRoute.Robots`) is required here because Next.js's typed
 * robots API has no field for the `Content-Signal` directive — see contentsignals.org.
 */
function buildRobotsTxt(): string {
  const disallow = DISALLOW_PATHS.map((path) => `Disallow: ${path}`).join("\n")

  return `# As a condition of accessing this website, you agree to
# abide by the following content signals:
# (a) If a content-signal = yes, you may collect content
#     for the corresponding use.
# (b) If a content-signal = no, you may not collect content
#     for the corresponding use.
# (c) If the website operator does not include a content
#     signal for a corresponding use, the website operator
#     neither grants nor restricts permission via content signal
#     with respect to the corresponding use.
# The content signals and their meanings are:
# search: building a search index and providing search
#     results (e.g., returning hyperlinks and short excerpts
#     from your website's contents). Search does not include
#     providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models
#     (e.g., retrieval augmented generation, grounding, or other
#     real-time taking of content for generative AI search
#     answers).
# ai-train: training or fine-tuning AI models.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
Allow: /_next/
${disallow}

Sitemap: ${baseUrl}/sitemap_index.xml
Host: ${baseUrl}
`
}

export function GET() {
  return new NextResponse(buildRobotsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  })
}
