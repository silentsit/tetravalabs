import { groupProductsByCategory } from "@/lib/categories"
import { listAllProducts } from "@/lib/medusa"
import { listBlogPosts } from "@/lib/sanity"

export const SITEMAP_REVALIDATE_SECONDS = 3600
export const SITEMAP_XSL_PATH = "/main-sitemap.xsl"

function xmlDeclaration(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${SITEMAP_XSL_PATH}"?>\n${body}`
}

export function getSitemapBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

export function formatSitemapDate(date: Date) {
  return date.toISOString().replace(/\.\d{3}Z$/, "+00:00")
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${SITEMAP_REVALIDATE_SECONDS}, stale-while-revalidate=86400`
    }
  })
}

export type SitemapUrlEntry = {
  loc: string
  lastModified?: Date
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export function renderUrlSet(entries: SitemapUrlEntry[]) {
  const urls = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`]
      if (entry.lastModified) {
        parts.push(`    <lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>`)
      }
      if (entry.changeFrequency) {
        parts.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (entry.priority != null) {
        parts.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`
    })
    .join("\n")

  return xmlDeclaration(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
}

export function renderSitemapIndex(entries: Array<{ loc: string; lastModified?: Date }>) {
  const items = entries
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`]
      if (entry.lastModified) {
        parts.push(`    <lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>`)
      }
      return `  <sitemap>\n${parts.join("\n")}\n  </sitemap>`
    })
    .join("\n")

  return xmlDeclaration(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`)
}

function maxDate(dates: Array<Date | undefined>) {
  const valid = dates.filter(Boolean) as Date[]
  if (!valid.length) return new Date()
  return new Date(Math.max(...valid.map((date) => date.getTime())))
}

const STATIC_PAGE_ROUTES: Array<{
  path: string
  changeFrequency: SitemapUrlEntry["changeFrequency"]
  priority: number
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/shop", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/coa-library", changeFrequency: "weekly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shipping", changeFrequency: "monthly", priority: 0.5 },
  { path: "/payment", changeFrequency: "monthly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.4 },
  { path: "/ruo", changeFrequency: "yearly", priority: 0.4 },
  { path: "/search", changeFrequency: "weekly", priority: 0.5 }
]

export async function getPageSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const now = new Date()

  return STATIC_PAGE_ROUTES.map((route) => ({
    loc: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }))
}

export async function getPostSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const posts = await listBlogPosts()

  return posts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6
  }))
}

export async function getProductSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const products = await listAllProducts()
  const now = new Date()

  return products.map((product) => ({
    loc: `${baseUrl}/product/${product.handle}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }))
}

export async function getCategorySitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const products = await listAllProducts()
  const categories = groupProductsByCategory(products)
  const now = new Date()

  return [
    {
      loc: `${baseUrl}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7
    },
    ...categories.map(
      (category): SitemapUrlEntry => ({
        loc: `${baseUrl}/category/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7
      })
    )
  ]
}

export async function getSitemapIndexEntries() {
  const baseUrl = getSitemapBaseUrl()
  const [pages, posts, products, categories] = await Promise.all([
    getPageSitemapEntries(),
    getPostSitemapEntries(),
    getProductSitemapEntries(),
    getCategorySitemapEntries()
  ])

  return [
    {
      loc: `${baseUrl}/post-sitemap.xml`,
      lastModified: maxDate(posts.map((entry) => entry.lastModified))
    },
    {
      loc: `${baseUrl}/page-sitemap.xml`,
      lastModified: maxDate(pages.map((entry) => entry.lastModified))
    },
    {
      loc: `${baseUrl}/product-sitemap.xml`,
      lastModified: maxDate(products.map((entry) => entry.lastModified))
    },
    {
      loc: `${baseUrl}/category-sitemap.xml`,
      lastModified: maxDate(categories.map((entry) => entry.lastModified))
    }
  ]
}
