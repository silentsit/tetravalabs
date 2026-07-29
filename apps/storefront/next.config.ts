import type { NextConfig } from "next"
import compoundLegacyRedirects from "./src/lib/compound-legacy-redirects.generated.json"

const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const legacyEntries = Object.entries(
  compoundLegacyRedirects as Record<string, { parent: string; strength: string }>
)

/** Legacy per-strength SKUs → parent compound handle (no query params). */
const compoundRedirects = legacyEntries.flatMap(([legacyHandle, { parent }]) => [
  {
    source: `/product/${legacyHandle}`,
    destination: `/${parent}`,
    permanent: true
  },
  {
    source: `/${legacyHandle}`,
    destination: `/${parent}`,
    permanent: true
  }
])

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
      { source: "/sitemap/categories.xml", destination: "/category-sitemap.xml", permanent: true },
      { source: "/sitemap/products-0.xml", destination: "/product-sitemap.xml", permanent: true },
      { source: "/coa", destination: "/coa-library", permanent: true },
      { source: "/ruo-disclaimer", destination: "/ruo", permanent: true },
      { source: "/refund-policy", destination: "/refund", permanent: true },
      // Specific legacy SKUs first, then catch-all /product/* → /*
      ...compoundRedirects,
      { source: "/product/:handle", destination: "/:handle", permanent: true }
    ]
  }
}

export default nextConfig
