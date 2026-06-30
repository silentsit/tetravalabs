import type { MetadataRoute } from "next"

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/orders", "/cart", "/login", "/register"]
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: ["/", "/llms.txt", "/blog", "/shop", "/coa-library", "/faq"]
      }
    ],
    sitemap: `${baseUrl}/sitemap_index.xml`,
    host: baseUrl
  }
}
