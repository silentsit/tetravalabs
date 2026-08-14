import type { NextConfig } from "next"

/**
 * Bots that must receive blocking HTML + metadata (no streaming).
 * Setting `htmlLimitedBots` *replaces* Next.js's default list, so Googlebot has
 * to be named: the default `[\w-]+-Google|Google-[\w-]+` pattern misses
 * `Googlebot` / `Googlebot-Image` (no hyphen after "Google").
 */
const htmlLimitedBots =
  /Googlebot(?:-\w+)?|[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const nextConfig: NextConfig = {
  htmlLimitedBots,
  trailingSlash: false,
  // Next.js otherwise 308s /foo/ ↔ /foo. Skip that so trailing-slash URLs 404.
  skipTrailingSlashRedirect: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
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
