import type { Metadata } from "next"
import { blogImageForPost } from "@/lib/blog-utils"
import { registerPageJsonLd } from "@/lib/json-ld-store"
import type { StoreProduct } from "@/lib/medusa"
import { productPath } from "@/lib/compound-product"
import { normalizeTb500DisplayText } from "@/lib/revamp/product-visual"
import { getProductPriceRangeCents } from "@/lib/product-price"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

/** Soft SERP budget; product titles use progressive fallbacks under this cap. */
export const META_TITLE_MAX = 70
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
  address: {
    streetAddress: "455 Gateway Drive",
    addressLocality: "Pacifica",
    addressRegion: "CA",
    postalCode: "94044",
    addressCountry: "US"
  },
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
  /** Schema.org page type for auto-registered WebPage graph. */
  pageType?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage"
  /** When true (default), auto-register a WebPage graph for `path`. */
  registerWebPage?: boolean
}

export function pageUrl(path = "") {
  if (!path || path === "/") return siteConfig.url
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`
}

const BRAND_SUFFIX = ` | ${siteConfig.name}`

/** Drop trailing separators left by length clamps (avoids "Name — | Brand"). */
function stripTrailingTitleSeparators(text: string) {
  return text.replace(/[\s|/\\•·–—-]+$/g, "").trim()
}

function truncateMetaText(text: string, max: number) {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) return normalized

  const slice = normalized.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  const clipped =
    lastSpace >= Math.floor(max * 0.5) ? slice.slice(0, lastSpace).trim() : slice.trim()

  return stripTrailingTitleSeparators(clipped)
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
      const pageType =
        input.pageType ||
        (input.path === "/shop" || input.path === "/categories" || input.path === "/blog" || input.path === "/coa-library"
          ? "CollectionPage"
          : input.path === "/contact"
            ? "ContactPage"
            : "WebPage")
      graphs.push(
        webPageJsonLd({
          title: shortTitle,
          description,
          path: input.path,
          type: pageType
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
  description?: string | null
  variants?: Array<{
    id: string
    sku?: string | null
    prices?: Array<{ amount: number }>
    calculated_price?: { calculated_amount?: number }
    inventory_quantity?: number | null
    manage_inventory?: boolean | null
    allow_backorder?: boolean | null
  }>
  metadata?: Record<string, unknown> | null
}

function productPriceRange(product: ProductLike) {
  const { min, max } = getProductPriceRangeCents(product as StoreProduct)
  return { low: min / 100, high: max / 100 }
}

function isProductLikeVariantInStock(
  variant: NonNullable<ProductLike["variants"]>[number] | undefined
): boolean {
  if (!variant) return false
  if (variant.manage_inventory === false) return true
  if (variant.allow_backorder) return true
  if (variant.inventory_quantity == null) return true
  return variant.inventory_quantity > 0
}

function productAvailability(product: ProductLike) {
  const variants = product.variants || []
  if (!variants.length) return "https://schema.org/OutOfStock"
  return variants.some((variant) => isProductLikeVariantInStock(variant))
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock"
}

export type ProductReviewSchemaInput = {
  ratingValue: number
  reviewCount: number
  reviews?: Array<{
    authorName: string
    rating: number
    body: string
    datePublished?: string
  }>
}

export function productJsonLd(
  product: ProductLike,
  handle: string,
  imagePath?: string,
  reviewData?: ProductReviewSchemaInput | null
) {
  const displayTitle = normalizeTb500DisplayText(product.title)
  const categoryLabel = normalizeTb500DisplayText(
    String(product.metadata?.source_category || "Research Product")
  )
  const { low, high } = productPriceRange(product)
  const offerPrice = low || high
  const image = imagePath || `/products/${handle}.jpg`
  const sku =
    product.variants?.find((variant) => variant.sku)?.sku || product.variants?.[0]?.id
  const description = normalizeTb500DisplayText(
    (typeof product.description === "string" && product.description.trim()) ||
      `${displayTitle} — research-use only (RUO) peptide with HPLC-MS verification.`
  )
  const availability = productAvailability(product)
  const hasRange = Boolean(low && high && low !== high)
  const offers = hasRange
    ? {
        "@type": "AggregateOffer",
        url: pageUrl(productPath(handle)),
        priceCurrency: "USD",
        lowPrice: low,
        highPrice: high,
        offerCount: product.variants?.length || 1,
        availability,
        itemCondition: "https://schema.org/NewCondition"
      }
    : {
        "@type": "Offer",
        url: pageUrl(productPath(handle)),
        priceCurrency: "USD",
        price: offerPrice || undefined,
        availability,
        itemCondition: "https://schema.org/NewCondition"
      }

  const graph: JsonLdGraph = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: displayTitle,
    description,
    image: image.startsWith("http") ? image : pageUrl(image),
    sku,
    category: categoryLabel,
    brand: { "@type": "Brand", name: "Tetrava Labs" },
    offers
  }

  // Only emit when real reviews exist — never invent ratings for GSC.
  if (reviewData && reviewData.reviewCount > 0 && reviewData.ratingValue > 0) {
    graph.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(reviewData.ratingValue.toFixed(1)),
      reviewCount: reviewData.reviewCount,
      bestRating: 5,
      worstRating: 1
    }

    const nested = (reviewData.reviews || [])
      .filter((item) => item.rating > 0 && item.body.trim())
      .slice(0, 6)
      .map((item) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: item.authorName.trim() || "Verified buyer"
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: item.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: item.body.trim(),
        ...(item.datePublished ? { datePublished: item.datePublished } : {})
      }))

    if (nested.length) graph.review = nested
  }

  return graph
}

export function articleJsonLd(post: {
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  category?: string
  image?: string
}) {
  const imagePath = blogImageForPost({
    image: post.image,
    category: post.category as "Protocols" | "Analytical" | "Compliance" | undefined
  })

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: pageUrl(imagePath),
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: pageUrl(siteConfig.defaultOgImage)
    },
    mainEntityOfPage: pageUrl(`/blog/${post.slug}`)
  }
}

function resolveSocialProfiles() {
  const fromEnv = [
    process.env.NEXT_PUBLIC_TWITTER_URL,
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL
  ]
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value))

  return fromEnv
}

export function organizationJsonLd() {
  const sameAs = resolveSocialProfiles()
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: pageUrl(siteConfig.defaultOgImage),
    email: siteConfig.contactEmail,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: "English"
    },
    ...(sameAs.length ? { sameAs } : {})
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
