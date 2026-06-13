import type { MetadataRoute } from "next"
import { listBlogPosts } from "@/lib/sanity"
import { listAllProducts } from "@/lib/medusa"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/shop",
    "/categories",
    "/coa-library",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/terms",
    "/privacy",
    "/refund",
    "/ruo",
    "/search"
  ]

  const [posts, products] = await Promise.all([listBlogPosts(), listAllProducts()])

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: route === "/shop" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
    lastModified: new Date()
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date()
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/product/${product.handle}`,
    changeFrequency: "weekly",
    priority: 0.8,
    lastModified: new Date()
  }))

  return [...staticEntries, ...blogEntries, ...productEntries]
}
