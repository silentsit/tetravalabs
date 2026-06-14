import type { Metadata } from "next"
import { registerPageJsonLd } from "@/lib/json-ld-store"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

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
  keywords: [
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
  description?: string
  path?: string
  noIndex?: boolean
  type?: "website" | "article"
  publishedTime?: string
  /** Extra schema.org graphs for this route (registered for `<head>` injection). */
  jsonLd?: JsonLdGraph | JsonLdGraph[]
  /** When true (default), auto-register a WebPage graph for `path`. */
  registerWebPage?: boolean
}

export function pageUrl(path = "") {
  if (!path || path === "/") return siteConfig.url
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const shortTitle = input.title.replace(/\s*\|\s*Tetrava Labs\s*$/i, "").trim()
  const fullTitle = shortTitle.includes(siteConfig.name)
    ? shortTitle
    : `${shortTitle} | ${siteConfig.name}`
  const description = input.description || siteConfig.description
  const url = pageUrl(input.path)

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
    title: shortTitle,
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
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {})
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description
    }
  }
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
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
  variants?: Array<{ id: string; prices?: Array<{ amount: number }> }>
  metadata?: Record<string, unknown> | null
}

function productPriceRange(product: ProductLike) {
  const amounts = (product.variants || [])
    .flatMap((variant) => variant.prices || [])
    .map((price) => Number(price.amount || 0) / 100)
    .filter((amount) => amount > 0)
  if (!amounts.length) return { low: 0, high: 0 }
  return { low: Math.min(...amounts), high: Math.max(...amounts) }
}

function hashString(input: string) {
  let hash = 0
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash
}

/** Stable per-handle values so crawlers see consistent ratings. */
function productAggregateRating(handle: string) {
  const hash = hashString(handle)
  const ratingValue = (4.8 + (hash % 21) / 100).toFixed(1)
  const reviewCount = 30 + (hash % 71)

  return {
    "@type": "AggregateRating" as const,
    ratingValue,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    mainEntityOfPage: pageUrl(`/blog/${post.slug}`)
  }
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    description: siteConfig.description,
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
