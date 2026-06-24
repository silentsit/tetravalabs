import { groupProductsByCategory } from "@/lib/categories"
import { listAllProducts } from "@/lib/medusa"
import { listBlogPosts } from "@/lib/sanity"

export const SITEMAP_REVALIDATE_SECONDS = 3600
export const PRODUCT_SITEMAP_CHUNK_SIZE = 50_000
export const SITEMAP_XSL_PATH = "/main-sitemap.xsl"

export type SitemapUrlEntry = {
  loc: string
  lastModified?: Date
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
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

export function getSitemapBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

export function childSitemapPath(id: string) {
  return `/sitemap/${id}.xml`
}

function xmlDeclaration(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${SITEMAP_XSL_PATH}"?>\n${body}`
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
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

  return xmlDeclaration(
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`
  )
}

function maxDate(dates: Array<Date | undefined>) {
  const valid = dates.filter(Boolean) as Date[]
  if (!valid.length) return new Date()
  return new Date(Math.max(...valid.map((date) => date.getTime())))
}

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

export async function getAllProductSitemapEntries(): Promise<SitemapUrlEntry[]> {
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

export async function getProductSitemapEntries(chunk = 0): Promise<SitemapUrlEntry[]> {
  const products = await getAllProductSitemapEntries()
  const start = chunk * PRODUCT_SITEMAP_CHUNK_SIZE
  return products.slice(start, start + PRODUCT_SITEMAP_CHUNK_SIZE)
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

export async function getSitemapIds(): Promise<Array<{ id: string }>> {
  const products = await getAllProductSitemapEntries()
  const chunkCount = Math.max(1, Math.ceil(products.length / PRODUCT_SITEMAP_CHUNK_SIZE))

  const ids: Array<{ id: string }> = [
    { id: "posts" },
    { id: "pages" },
    { id: "categories" }
  ]

  for (let index = 0; index < chunkCount; index += 1) {
    ids.push({ id: `products-${index}` })
  }

  return ids
}

export async function getSitemapIndexEntries() {
  const baseUrl = getSitemapBaseUrl()
  const [pages, posts, products, categories, ids] = await Promise.all([
    getPageSitemapEntries(),
    getPostSitemapEntries(),
    getAllProductSitemapEntries(),
    getCategorySitemapEntries(),
    getSitemapIds()
  ])

  const productLastModified = maxDate(products.map((entry) => entry.lastModified))

  return ids.map((entry) => {
    let lastModified = new Date()

    if (entry.id === "pages") lastModified = maxDate(pages.map((item) => item.lastModified))
    if (entry.id === "posts") lastModified = maxDate(posts.map((item) => item.lastModified))
    if (entry.id === "categories") lastModified = maxDate(categories.map((item) => item.lastModified))
    if (entry.id.startsWith("products-")) lastModified = productLastModified

    return {
      loc: `${baseUrl}${childSitemapPath(entry.id)}`,
      lastModified
    }
  })
}

export async function getSitemapEntriesById(id: string): Promise<SitemapUrlEntry[]> {
  if (id === "pages") return getPageSitemapEntries()
  if (id === "posts") return getPostSitemapEntries()
  if (id === "categories") return getCategorySitemapEntries()

  if (id.startsWith("products-")) {
    const chunk = Number(id.slice("products-".length))
    if (!Number.isFinite(chunk)) return []
    return getProductSitemapEntries(chunk)
  }

  return []
}

export function toMetadataSitemap(entries: SitemapUrlEntry[]) {
  return entries.map((entry) => ({
    url: entry.loc,
    lastModified: entry.lastModified,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  }))
}
