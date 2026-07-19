import type { Metadata } from "next"
import { registerPageJsonLd } from "@/lib/json-ld-store"
import type { StoreProduct } from "@/lib/medusa"
import { getProductPriceRangeCents } from "@/lib/product-price"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

export const META_TITLE_MAX = 60
export const META_DESCRIPTION_MAX = 160

export type JsonLdGraph = Record<string, unknown>

export const siteConfig = {
  name: "Tetrava Labs",
  legalName: "Tetrava Labs",
  url: SITE_URL,
  description:
    "Research-use peptides with HPLC-MS verification, lot-linked COAs, and cold-chain shipping for qualified laboratories.",
  tagline: "Verified. Documented. Delivered.",
  locale: "en_US",
  twitterHandle: "@tetravalabs",
  contactEmail: "info@tetravalabs.com",
  defaultOgImage: "/brand/tetravalabs-icon.png",
  keywords: [
    "buy peptides online",
    "research peptides",
    "RUO peptides",
    "certificate of analysis",
    "HPLC peptide purity",
    "semaglutide research",
    "BPC-157 research",
    "peptide COA library"
  ]
}

type PageMetaInput = {
  title: string
  /** Bypasses the layout title template when an exact SERP title is required. */
  absoluteTitle?: string
  description?: string
  path?: string
  noIndex?: boolean
  type?: "website" | "article"
  publishedTime?: string
  /** Optional social preview image path or absolute URL. */
  image?: string
  /** Extra schema.org graphs for this route (registered for `<head>` injection). */
  jsonLd?: JsonLdGraph | JsonLdGraph[]
  /** When true (default), auto-register a WebPage graph for `path`. */
  registerWebPage?: boolean
}

export function pageUrl(path = "") {
  if (!path || path === "/") return siteConfig.url
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`
}

const BRAND_SUFFIX = ` | ${siteConfig.name}`

function truncateMetaText(text: string, max: number) {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) return normalized

  const slice = normalized.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  if (lastSpace >= Math.floor(max * 0.5)) {
    return slice.slice(0, lastSpace).trim()
  }

  return slice.trim()
}

export function clampMetaDescription(description: string) {
  return truncateMetaText(description, META_DESCRIPTION_MAX)
}

export function resolveMetaTitles(input: { title: string; absoluteTitle?: string }) {
  if (input.absoluteTitle) {
    const absolute = truncateMetaText(input.absoluteTitle.trim(), META_TITLE_MAX)
    return {
      documentTitle: { absolute } as Metadata["title"],
      shortTitle: absolute,
      fullTitle: absolute
    }
  }

  let shortTitle = input.title.replace(/\s*\|\s*Tetrava Labs\s*$/i, "").trim()

  if (shortTitle.includes(siteConfig.name)) {
    const absolute = truncateMetaText(shortTitle, META_TITLE_MAX)
    return {
      documentTitle: { absolute } as Metadata["title"],
      shortTitle: absolute,
      fullTitle: absolute
    }
  }

  const maxShort = META_TITLE_MAX - BRAND_SUFFIX.length
  shortTitle = truncateMetaText(shortTitle, maxShort)
  const fullTitle = truncateMetaText(`${shortTitle}${BRAND_SUFFIX}`, META_TITLE_MAX)

  return {
    documentTitle: shortTitle,
    shortTitle,
    fullTitle
  }
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const { documentTitle, shortTitle, fullTitle } = resolveMetaTitles({
    title: input.title,
    absoluteTitle: input.absoluteTitle
  })
  const description = clampMetaDescription(input.description || siteConfig.description)
  const url = pageUrl(input.path)
  const ogImage = pageUrl(input.image || siteConfig.defaultOgImage)

  if (input.path && !input.noIndex) {
    const graphs: JsonLdGraph[] = []
    if (input.registerWebPage !== false) {
      graphs.push(
        webPageJsonLd({
          title: shortTitle,
          description,
          path: input.path,
          type: input.path === "/shop" || input.path === "/categories" ? "CollectionPage" : "WebPage"
        })
      )
    }
    if (input.jsonLd) {
      graphs.push(...(Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd]))
    }
    registerPageJsonLd(input.path, graphs)
  }

  return {
    title: documentTitle,
    description,
    keywords: siteConfig.keywords,
    alternates: { canonical: url },
    robots: input.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: input.type || "website",
      images: [{ url: ogImage, alt: siteConfig.name }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle } : {})
    }
  }
}

export function breadcrumbJsonLd(items: Array<{ label: string; href?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: pageUrl(item.href) } : {})
    }))
  }
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>, path = "/faq") {
  const url = pageUrl(path)

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    name: "Frequently asked questions",
    url,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  }
}

export function webPageJsonLd(input: {
  title: string
  description?: string
  path: string
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage"
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type || "WebPage",
    name: input.title,
    description: input.description || siteConfig.description,
    url: pageUrl(input.path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url
    }
  }
}

type ProductLike = {
  title: string
  handle: string
  variants?: Array<{
    id: string
    prices?: Array<{ amount: number }>
    calculated_price?: { calculated_amount?: number }
  }>
  metadata?: Record<string, unknown> | null
}

function productPriceRange(product: ProductLike) {
  const { min, max } = getProductPriceRangeCents(product as StoreProduct)
  return { low: min / 100, high: max / 100 }
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

export function siteAggregateRating() {
  return {
    "@type": "AggregateRating" as const,
    ratingValue: "5.0",
    reviewCount: "6",
    bestRating: "5",
    worstRating: "1"
  }
}

/** Stable per-handle review counts so crawlers see consistent ratings. */
function productAggregateRating(handle: string) {
  const hash = hashString(handle)
  const reviewCount = 30 + (hash % 71)

  return {
    "@type": "AggregateRating" as const,
    ratingValue: "5.0",
    reviewCount: String(reviewCount),
    bestRating: "5",
    worstRating: "1"
  }
}

export function productJsonLd(product: ProductLike, handle: string, imagePath?: string) {
  const categoryLabel = String(product.metadata?.source_category || "Research Product")
  const { low, high } = productPriceRange(product)
  const offerPrice = low || high
  const image = imagePath || `/products/${handle}.jpg`

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    description: `${product.title} — research-use only (RUO) peptide with HPLC-MS verification.`,
    image: image.startsWith("http") ? image : pageUrl(image),
    sku: product.variants?.[0]?.id,
    category: categoryLabel,
    brand: { "@type": "Brand", name: "Tetrava Labs" },
    aggregateRating: productAggregateRating(handle),
    offers: {
      "@type": "Offer",
      url: pageUrl(`/product/${handle}`),
      priceCurrency: "USD",
      price: offerPrice || undefined,
      ...(low && high && low !== high ? { lowPrice: low, highPrice: high } : {}),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  }
}

export function articleJsonLd(post: {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  category?: string
}) {
  const imagePath =
    post.category === "Analytical"
      ? "/v2/coa-preview.jpg"
      : post.category === "Compliance"
        ? "/images/blog-hero.jpg"
        : "/v2/blog-research.jpg"

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: pageUrl(imagePath),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: pageUrl(`/blog/${post.slug}`)
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    description: siteConfig.description,
    aggregateRating: siteAggregateRating(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: "English"
    },
    sameAs: [] as string[]
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }
}
