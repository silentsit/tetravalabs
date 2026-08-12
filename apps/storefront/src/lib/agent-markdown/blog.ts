import "server-only"

import { getBlogPostBySlug } from "@/lib/sanity"
import { formatReadTime } from "@/lib/blog-utils"
import { portableTextToMarkdown } from "@/lib/agent-markdown/portable-text-to-markdown"
import { type AgentMarkdownPage, wrapAgentMarkdown } from "@/lib/agent-markdown/shared"

export async function getBlogPostAgentMarkdownPage(slug: string): Promise<AgentMarkdownPage | null> {
  const post = await getBlogPostBySlug(slug)
  if (!post) return null

  const path = `/blog/${post.slug}`
  const description = post.excerpt || `${post.title} — Tetrava Labs research article.`
  const bodyMarkdown = portableTextToMarkdown(post.body)

  const meta = [
    post.category ? `Category: ${post.category}` : "",
    `Read time: ${formatReadTime(post.readTimeMinutes)}`,
    post.publishedAt ? `Published: ${post.publishedAt.slice(0, 10)}` : ""
  ]
    .filter(Boolean)
    .join(" · ")

  const references = post.references?.length
    ? [
        "## References",
        "",
        post.references
          .map((ref, index) => {
            const citation =
              ref.citationText ||
              [ref.title, ref.authors, ref.publication, ref.year].filter(Boolean).join(". ")
            return `${index + 1}. ${citation}${ref.url ? ` — ${ref.url}` : ""}`
          })
          .join("\n")
      ].join("\n")
    : ""

  return {
    title: post.title,
    description,
    body: wrapAgentMarkdown({
      title: post.title,
      description,
      path,
      body: [meta, bodyMarkdown, references].filter(Boolean).join("\n\n")
    })
  }
}
