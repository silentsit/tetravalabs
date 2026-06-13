import type { Metadata } from "next"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")

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
