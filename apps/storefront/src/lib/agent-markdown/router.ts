import "server-only"

import type { AgentMarkdownPage } from "@/lib/agent-markdown/shared"
import { getStaticAgentMarkdownPage, isStaticAgentMarkdownPath } from "@/lib/agent-markdown/static-pages"
import { getCategoryAgentMarkdownPage } from "@/lib/agent-markdown/category"
import { getBlogPostAgentMarkdownPage } from "@/lib/agent-markdown/blog"
import { getProductAgentMarkdownPage } from "@/lib/agent-markdown/product"

const CATEGORY_PATH_RE = /^\/category\/([^/]+)$/
const BLOG_POST_PATH_RE = /^\/blog\/([^/]+)$/
const SINGLE_SEGMENT_RE = /^\/([^/]+)$/

/** Resolves a canonical storefront pathname to its AI-agent markdown mirror, or null if none applies. */
export async function resolveMarkdownForPath(pathname: string): Promise<AgentMarkdownPage | null> {
  if (isStaticAgentMarkdownPath(pathname)) return getStaticAgentMarkdownPage(pathname)

  const categoryMatch = pathname.match(CATEGORY_PATH_RE)
  if (categoryMatch) return getCategoryAgentMarkdownPage(categoryMatch[1])

  const blogMatch = pathname.match(BLOG_POST_PATH_RE)
  if (blogMatch) return getBlogPostAgentMarkdownPage(blogMatch[1])

  const productMatch = pathname.match(SINGLE_SEGMENT_RE)
  if (productMatch) return getProductAgentMarkdownPage(productMatch[1])

  return null
}
