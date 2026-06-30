import type { NextConfig } from "next"

const htmlLimitedBots =
  /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|ChatGPT-User|ClaudeBot|Anthropic-AI|PerplexityBot|Perplexity-User|CCBot/i

const nextConfig: NextConfig = {
  htmlLimitedBots,
  images: {
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
      { source: "/refund-policy", destination: "/refund", permanent: true }
    ]
  }
}

export default nextConfig
