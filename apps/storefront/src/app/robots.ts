import type { MetadataRoute } from "next"

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

/**
 * Keep AI-bot rules aligned with Cloudflare Managed robots (currently Disallow: /).
 * To allow citation crawlers later, allow the same bots in Cloudflare AI Crawl Control
 * and flip the rule below to Allow selected paths.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/orders", "/cart", "/login", "/register", "/search"]
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        disallow: "/"
      }
    ],
    sitemap: `${baseUrl}/sitemap_index.xml`,
    host: baseUrl
  }
}
