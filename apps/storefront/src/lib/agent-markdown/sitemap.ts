import "server-only"

import { getHtmlSitemapData, renderHtmlSitemapMarkdown } from "@/lib/html-sitemap"
import { type AgentMarkdownPage, wrapAgentMarkdown } from "@/lib/agent-markdown/shared"

const TITLE = "Sitemap"
const DESCRIPTION =
  "HTML sitemap of Tetrava Labs: research peptide product pages, categories, Research Hub articles, and policy pages."

export async function getHtmlSitemapMarkdownPage(): Promise<AgentMarkdownPage> {
  const data = await getHtmlSitemapData()
  return {
    title: TITLE,
    description: DESCRIPTION,
    body: wrapAgentMarkdown({
      title: TITLE,
      description: DESCRIPTION,
      path: "/sitemap",
      body: renderHtmlSitemapMarkdown(data)
    })
  }
}
