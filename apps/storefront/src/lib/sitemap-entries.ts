import { blogImageForPost } from "@/lib/blog-utils"
import { groupProductsByCategory } from "@/lib/categories"
import { getCompoundParentHandle, productPath } from "@/lib/compound-product"
import { listAllProducts } from "@/lib/medusa"
import { getProductGalleryImages } from "@/lib/product-image-map"
import { getProductDisplayName } from "@/lib/revamp/product-visual"
import { listBlogPosts } from "@/lib/sanity"

export const SITEMAP_REVALIDATE_SECONDS = 3600
export const PRODUCT_SITEMAP_CHUNK_SIZE = 50_000
export function getSitemapXslHref() {
  const host = new URL(getSitemapBaseUrl()).host
  return `//${host}/main-sitemap.xsl`
}

export type SitemapUrlEntry = {
  loc: string
  lastModified?: Date
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority?: number
}

export type SitemapImageEntry = {
  loc: string
  title?: string
  caption?: string
}

export type SitemapImageUrlEntry = {
  loc: string
  lastModified?: Date
  images: SitemapImageEntry[]
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
  { path: "/ruo", changeFrequency: "yearly", priority: 0.4 }
]

export function getSitemapBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

export function absoluteSitemapUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const baseUrl = getSitemapBaseUrl()
  return pathOrUrl.startsWith("/") ? `${baseUrl}${pathOrUrl}` : `${baseUrl}/${pathOrUrl}`
}

/** Rank Math / WooCommerce-style public sitemap URLs (Bangkok Peptides pattern). */
export function publicChildSitemapPath(id: string) {
  if (id === "posts") return "/post-sitemap.xml"
  if (id === "pages") return "/page-sitemap.xml"
  if (id === "images") return "/image-sitemap.xml"
  if (id === "categories") return "/category-sitemap.xml"
  if (id === "products-0") return "/product-sitemap.xml"
  if (id.startsWith("products-")) {
    const chunk = id.slice("products-".length)
    return chunk === "0" ? "/product-sitemap.xml" : `/product-sitemap-${chunk}.xml`
  }
  return `/sitemap/${id}.xml`
}

function xmlDeclaration(body: string) {
  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="${getSitemapXslHref()}"?>\n${body}`
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

export function renderSitemapImageUrlSet(entries: SitemapImageUrlEntry[]) {
  const items = entries
    .filter((entry) => entry.images.length > 0)
    .map((entry) => {
      const parts = [`    <loc>${escapeXml(entry.loc)}</loc>`]
      if (entry.lastModified) {
        parts.push(`    <lastmod>${formatSitemapDate(entry.lastModified)}</lastmod>`)
      }
      for (const image of entry.images) {
        const imageParts = [`      <image:loc>${escapeXml(image.loc)}</image:loc>`]
        if (image.title?.trim()) {
          imageParts.push(`      <image:title>${escapeXml(image.title.trim())}</image:title>`)
        }
        if (image.caption?.trim()) {
          imageParts.push(`      <image:caption>${escapeXml(image.caption.trim())}</image:caption>`)
        }
        parts.push(`    <image:image>\n${imageParts.join("\n")}\n    </image:image>`)
      }
      return `  <url>\n${parts.join("\n")}\n  </url>`
    })
    .join("\n")

  return xmlDeclaration(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${items}\n</urlset>\n`
  )
}

export function renderSitemapUrlSet(entries: SitemapUrlEntry[]) {
  const items = entries
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

  return xmlDeclaration(
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`
  )
}

function maxDate(dates: Array<Date | undefined>) {
  const valid = dates.filter(Boolean) as Date[]
  if (!valid.length) return undefined
  return new Date(Math.max(...valid.map((date) => date.getTime())))
}

export async function getPageSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()

  return STATIC_PAGE_ROUTES.map((route) => ({
    loc: `${baseUrl}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }))
}

export async function getPostSitemapEntries(): Promise<SitemapUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const posts = await listBlogPosts()

  return posts.map((post) => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt
      ? new Date(post.updatedAt)
      : post.publishedAt
        ? new Date(post.publishedAt)
        : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }))
}

export async function getAllProductSitemapEntries(): Promise<SitemapUrlEntry[]> {
  return buildProductSitemapEntries(await listAllProducts())
}

function buildProductSitemapEntries(products: Awaited<ReturnType<typeof listAllProducts>>): SitemapUrlEntry[] {
  const baseUrl = getSitemapBaseUrl()

  const locs = new Set(
    products.map((product) => {
      const parent = getCompoundParentHandle(product.handle) || product.handle
      return `${baseUrl}${productPath(parent)}`
    })
  )

  return [...locs].map((loc) => ({
    loc,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }))
}

export async function getProductSitemapEntries(chunk = 0): Promise<SitemapUrlEntry[]> {
  const products = await getAllProductSitemapEntries()
  const start = chunk * PRODUCT_SITEMAP_CHUNK_SIZE
  return products.slice(start, start + PRODUCT_SITEMAP_CHUNK_SIZE)
}

function uniqueImageEntries(images: SitemapImageEntry[]) {
  const seen = new Set<string>()
  return images.filter((image) => {
    if (seen.has(image.loc)) return false
    seen.add(image.loc)
    return true
  })
}

/** Product PDP galleries + blog covers only — skip homepage/category decorative art. */
export async function getImageSitemapEntries(): Promise<SitemapImageUrlEntry[]> {
  const baseUrl = getSitemapBaseUrl()
  const [products, posts] = await Promise.all([listAllProducts(), listBlogPosts()])
  const entries: SitemapImageUrlEntry[] = []

  const productPages = new Map<string, { title: string; images: SitemapImageEntry[] }>()
  for (const product of products) {
    const parentHandle = getCompoundParentHandle(product.handle) || product.handle
    const pageLoc = `${baseUrl}${productPath(parentHandle)}`
    const title = getProductDisplayName(product)
    const gallery = getProductGalleryImages(parentHandle).map((imagePath) => ({
      loc: absoluteSitemapUrl(imagePath),
      title
    }))

    const existing = productPages.get(pageLoc)
    if (existing) {
      existing.images.push(...gallery)
      continue
    }

    productPages.set(pageLoc, { title, images: gallery })
  }

  for (const [loc, page] of productPages) {
    const images = uniqueImageEntries(page.images)
    if (!images.length) continue

    entries.push({
      loc,
      images
    })
  }

  for (const post of posts) {
    const images = uniqueImageEntries([
      {
        loc: absoluteSitemapUrl(blogImageForPost(post)),
        title: post.title,
        caption: post.excerpt
      }
    ])
    if (!images.length) continue

    entries.push({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt
        ? new Date(post.updatedAt)
        : post.publishedAt
          ? new Date(post.publishedAt)
          : undefined,
      images
    })
  }

  return entries
}

export async function getCategorySitemapEntries(): Promise<SitemapUrlEntry[]> {
  return buildCategorySitemapEntries(await listAllProducts())
}

function buildCategorySitemapEntries(products: Awaited<ReturnType<typeof listAllProducts>>): SitemapUrlEntry[] {
  const baseUrl = getSitemapBaseUrl()
  const categories = groupProductsByCategory(products)

  return [
    {
      loc: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.7
    },
    ...categories.map(
      (category): SitemapUrlEntry => ({
        loc: `${baseUrl}/category/${category.slug}`,
        changeFrequency: "weekly",
        priority: 0.7
      })
    )
  ]
}

function buildSitemapIds(productCount: number): Array<{ id: string }> {
  const chunkCount = Math.max(1, Math.ceil(productCount / PRODUCT_SITEMAP_CHUNK_SIZE))

  const ids: Array<{ id: string }> = [{ id: "posts" }, { id: "pages" }, { id: "images" }]

  for (let index = 0; index < chunkCount; index += 1) {
    ids.push({ id: `products-${index}` })
  }

  ids.push({ id: "categories" })

  return ids
}

export async function getSitemapIds(): Promise<Array<{ id: string }>> {
  const products = await getAllProductSitemapEntries()
  return buildSitemapIds(products.length)
}

export async function getSitemapIndexEntries() {
  const baseUrl = getSitemapBaseUrl()
  const [pages, posts, catalog] = await Promise.all([
    getPageSitemapEntries(),
    getPostSitemapEntries(),
    listAllProducts()
  ])

  const products = buildProductSitemapEntries(catalog)
  const categories = buildCategorySitemapEntries(catalog)
  const ids = buildSitemapIds(products.length)
  const pageLastModified = maxDate(pages.map((item) => item.lastModified))
  const postLastModified = maxDate(posts.map((item) => item.lastModified))
  const productLastModified = maxDate(products.map((entry) => entry.lastModified))
  const categoryLastModified = maxDate(categories.map((item) => item.lastModified))
  const imageLastModified = postLastModified

  return ids.map((entry) => {
    let lastModified: Date | undefined

    if (entry.id === "pages") lastModified = pageLastModified
    if (entry.id === "posts") lastModified = postLastModified
    if (entry.id === "images") lastModified = imageLastModified
    if (entry.id === "categories") lastModified = categoryLastModified
    if (entry.id.startsWith("products-")) lastModified = productLastModified

    return {
      loc: `${baseUrl}${publicChildSitemapPath(entry.id)}`,
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
