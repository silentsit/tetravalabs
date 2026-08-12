import "server-only"

import { getSitemapBaseUrl } from "@/lib/sitemap-entries"

export type AgentMarkdownPage = {
  title: string
  description: string
  body: string
}

const RUO_NOTICE =
  "> Research Use Only (RUO). Not for human consumption, clinical use, or veterinary use. Buyers must be qualified research professionals or institutions."

function jsonLine(key: string, value: string): string {
  return `${key}: ${JSON.stringify(value)}`
}

/** Canonical absolute URL for a site-relative path (`/` or `/foo`). */
export function absoluteUrlForPath(path: string): string {
  const baseUrl = getSitemapBaseUrl()
  if (!path || path === "/") return baseUrl
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

/**
 * Wraps builder output with frontmatter, the RUO notice, and a sitemap
 * discovery footer, per the Agent Readability content-negotiation spec.
 */
export function wrapAgentMarkdown(input: {
  title: string
  description: string
  path: string
  body: string
}): string {
  const canonicalUrl = absoluteUrlForPath(input.path)
  const frontmatter = [
    "---",
    jsonLine("title", input.title),
    jsonLine("description", input.description),
    jsonLine("canonical_url", canonicalUrl),
    jsonLine("last_updated", new Date().toISOString().slice(0, 10)),
    "---"
  ].join("\n")

  const sitemapFooter = `## Sitemap\n\nSee the full [sitemap](${absoluteUrlForPath("/sitemap.md")}) for all pages.`

  return [
    frontmatter,
    "",
    `# ${input.title}`,
    "",
    RUO_NOTICE,
    "",
    input.body.trim(),
    "",
    sitemapFooter,
    ""
  ].join("\n")
}

export function renderQaSection(heading: string, items: Array<{ question: string; answer: string }>): string {
  if (!items.length) return ""
  const body = items.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")
  return `## ${heading}\n\n${body}`
}

export function mdLink(label: string, path: string): string {
  return `[${label}](${path})`
}
