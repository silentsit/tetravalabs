import "server-only"

import { groupProductsByCategory } from "@/lib/categories"
import { getCompoundParentHandle, productPath } from "@/lib/compound-product"
import { listAllProducts } from "@/lib/medusa"
import { getProductDisplayName } from "@/lib/revamp/product-visual"
import { listBlogPosts } from "@/lib/sanity"

export type HtmlSitemapLink = {
  href: string
  label: string
}

export type HtmlSitemapGroup = {
  heading: string
  href?: string
  links: HtmlSitemapLink[]
}

export type HtmlSitemapData = {
  pages: HtmlSitemapLink[]
  categories: HtmlSitemapLink[]
  productsByCategory: HtmlSitemapGroup[]
  posts: HtmlSitemapLink[]
}

const PAGE_LINKS: HtmlSitemapLink[] = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Research Hub" },
  { href: "/coa-library", label: "COA library" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/payment", label: "How to pay" },
  { href: "/terms", label: "Terms of service" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/refund", label: "Refund and delivery" },
  { href: "/ruo", label: "Research use only" },
  { href: "/sitemap", label: "Sitemap" }
]

function sortLinks(links: HtmlSitemapLink[]) {
  return [...links].sort((a, b) => a.label.localeCompare(b.label, "en"))
}

export async function getHtmlSitemapData(): Promise<HtmlSitemapData> {
  const [products, posts] = await Promise.all([listAllProducts(), listBlogPosts()])
  const categories = groupProductsByCategory(products)

  const productsByCategory = categories
    .map((category) => {
      const seen = new Set<string>()
      const links: HtmlSitemapLink[] = []

      for (const product of category.products) {
        const parent = getCompoundParentHandle(product.handle) || product.handle
        if (seen.has(parent)) continue
        seen.add(parent)
        links.push({
          href: productPath(parent),
          label: getProductDisplayName(product)
        })
      }

      return {
        heading: category.name,
        href: `/category/${category.slug}`,
        links: sortLinks(links)
      }
    })
    .filter((group) => group.links.length > 0)

  return {
    pages: PAGE_LINKS,
    categories: [
      { href: "/categories", label: "All categories" },
      ...categories.map((category) => ({
        href: `/category/${category.slug}`,
        label: category.name
      }))
    ],
    productsByCategory,
    posts: sortLinks(
      posts.map((post) => ({
        href: `/blog/${post.slug}`,
        label: post.title
      }))
    )
  }
}

export function renderHtmlSitemapMarkdown(data: HtmlSitemapData): string {
  const list = (links: HtmlSitemapLink[]) =>
    links.map((link) => `- [${link.label}](${link.href})`).join("\n")

  const productBlocks = data.productsByCategory
    .map((group) => {
      const heading = group.href ? `### [${group.heading}](${group.href})` : `### ${group.heading}`
      return `${heading}\n${list(group.links)}`
    })
    .join("\n\n")

  return [
    "## Pages",
    list(data.pages),
    "## Categories",
    list(data.categories),
    "## Products by category",
    productBlocks,
    "## Research Hub",
    list(data.posts)
  ].join("\n\n")
}
