import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/shop",
    "/coa-library",
    "/blog",
    "/terms",
    "/privacy",
    "/refund",
    "/ruo"
  ]

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
    lastModified: new Date()
  }))
}
