import type { NextConfig } from "next"
import compoundLegacyRedirects from "./src/lib/compound-legacy-redirects.generated.json"

const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const compoundRedirects = Object.entries(
  compoundLegacyRedirects as Record<string, { parent: string; strength: string }>
).map(([legacyHandle, { parent, strength }]) => ({
  source: `/product/${legacyHandle}`,
  destination: `/product/${parent}?strength=${encodeURIComponent(strength)}`,
  permanent: true
}))

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
      ...compoundRedirects
    ]
  }
}

export default nextConfig
