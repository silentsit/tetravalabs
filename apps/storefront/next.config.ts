import type { NextConfig } from "next"

const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const nextConfig: NextConfig = {
  htmlLimitedBots,
  // Canonicalize trailing slashes in middleware (301) instead of Next.js 308.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 1080],
    imageSizes: [128, 256],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io"
      }
    ]
  }
}

export default nextConfig
