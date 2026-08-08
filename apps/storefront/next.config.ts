import type { NextConfig } from "next"
import compoundLegacyRedirects from "./src/lib/compound-legacy-redirects.generated.json"
import {
  LEGACY_PRETTY_URL_REDIRECTS,
  PRODUCT_HANDLE_TO_URL,
  PRODUCT_URL_TO_HANDLE
} from "./src/lib/product-url-aliases"

const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const legacyEntries = Object.entries(
  compoundLegacyRedirects as Record<string, { parent: string; strength: string }>
)

function publicPathForCatalogHandle(handle: string): string {
  return PRODUCT_HANDLE_TO_URL[handle] || handle
}

/** Legacy per-strength SKUs → canonical public SEO slug. */
const compoundRedirects = legacyEntries.flatMap(([legacyHandle, { parent }]) => {
  const dest = publicPathForCatalogHandle(parent)
  return [
    {
      source: `/product/${legacyHandle}`,
      destination: `/${dest}`,
      permanent: true
    },
    {
      source: `/${legacyHandle}`,
      destination: `/${dest}`,
      permanent: true
    }
  ]
})

/** Catalog / Medusa parent handles → public SEO slug. */
const catalogToPublicRedirects = Object.entries(PRODUCT_HANDLE_TO_URL).flatMap(
  ([catalogHandle, publicSegment]) => {
    if (catalogHandle === publicSegment) return []
    return [
      {
        source: `/${catalogHandle}`,
        destination: `/${publicSegment}`,
        permanent: true
      },
      {
        source: `/product/${catalogHandle}`,
        destination: `/${publicSegment}`,
        permanent: true
      }
    ]
  }
)

/** Public SEO slug also reachable via /product/{slug}. */
const publicProductPrefixRedirects = Object.keys(PRODUCT_URL_TO_HANDLE).map((publicSegment) => ({
  source: `/product/${publicSegment}`,
  destination: `/${publicSegment}`,
  permanent: true
}))

/** Retired pretty capsule URLs → buy-*-online. */
const legacyPrettyRedirects = Object.entries(LEGACY_PRETTY_URL_REDIRECTS).flatMap(
  ([from, to]) => [
    { source: `/${from}`, destination: `/${to}`, permanent: true },
    { source: `/product/${from}`, destination: `/${to}`, permanent: true }
  ]
)

const nextConfig: NextConfig = {
  htmlLimitedBots,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      }
    ]
  },
  async redirects() {
    return [
      { source: "/sitemap.xml", destination: "/sitemap_index.xml", permanent: true },
      { source: "/sitemap/posts.xml", destination: "/post-sitemap.xml", permanent: true },
      { source: "/sitemap/pages.xml", destination: "/page-sitemap.xml", permanent: true },
      { source: "/sitemap/images.xml", destination: "/image-sitemap.xml", permanent: true },
      { source: "/sitemap/categories.xml", destination: "/category-sitemap.xml", permanent: true },
      { source: "/sitemap/products-0.xml", destination: "/product-sitemap.xml", permanent: true },
      { source: "/coa", destination: "/coa-library", permanent: true },
      { source: "/ruo-disclaimer", destination: "/ruo", permanent: true },
      { source: "/refund-policy", destination: "/refund", permanent: true },
      // Specific aliases first, then legacy strengths, then catch-all /product/* → /*
      ...legacyPrettyRedirects,
      ...catalogToPublicRedirects,
      ...publicProductPrefixRedirects,
      ...compoundRedirects,
      { source: "/product/:handle", destination: "/:handle", permanent: true }
    ]
  }
}

export default nextConfig
