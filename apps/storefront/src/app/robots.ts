import type { MetadataRoute } from "next"

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

/**
 * Allow search + AI crawlers the same public paths.
 * Private account/checkout routes stay disallowed.
 * Also confirm Cloudflare AI Crawl Control is not still blocking these bots at the edge.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
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
      }
    ],
    sitemap: `${baseUrl}/sitemap_index.xml`,
    host: baseUrl
  }
}
