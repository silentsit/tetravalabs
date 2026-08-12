import "server-only"

import type { BlogBody, BlogPortableBlock } from "@/lib/sanity"
import { isPortableBlogBody, parsePlainBlogBlocks } from "@/lib/blog-utils"

type PortableSpan = {
  text?: string
  marks?: string[]
}

type PortableMarkDef = {
  _key?: string
  _type?: string
  href?: string
}

function renderSpan(span: PortableSpan, markDefs: PortableMarkDef[]): string {
  let text = span.text || ""
  if (!text) return ""

  for (const mark of span.marks || []) {
    const linkDef = markDefs.find((def) => def._key === mark && def._type === "link" && def.href)
    if (linkDef?.href) {
      text = `[${text}](${linkDef.href})`
    } else if (mark === "strong") {
      text = `**${text}**`
    } else if (mark === "em") {
      text = `*${text}*`
    } else if (mark === "code") {
      text = `\`${text}\``
    }
  }
  return text
}

function renderBlock(block: BlogPortableBlock): string {
  if (block._type === "productEmbed") {
    const handle = typeof block.handle === "string" ? block.handle.trim() : ""
    return handle ? `[Related product](/${handle})` : ""
  }

  if (block._type !== "block") return ""

  const children = Array.isArray(block.children) ? (block.children as PortableSpan[]) : []
  const markDefs = Array.isArray(block.markDefs) ? (block.markDefs as PortableMarkDef[]) : []
  const text = children.map((child) => renderSpan(child, markDefs)).join("")
  if (!text.trim()) return ""

  const style = typeof block.style === "string" ? block.style : "normal"
  if (style === "h2") return `## ${text}`
  if (style === "h3") return `### ${text}`
  if (block.listItem === "bullet") return `- ${text}`
  if (block.listItem === "number") return `1. ${text}`
  return text
}

export function portableTextToMarkdown(body?: BlogBody): string {
  if (!body) return ""
  if (!isPortableBlogBody(body)) {
    return parsePlainBlogBlocks(body)
      .map((block) => {
        if (block.type === "h2") return `## ${block.text}`
        if (block.type === "h3") return `### ${block.text}`
        return block.text
      })
      .join("\n\n")
  }

  return body
    .map(renderBlock)
    .filter(Boolean)
    .join("\n\n")
}
