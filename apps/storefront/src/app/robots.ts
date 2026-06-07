import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/account", "/orders"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
