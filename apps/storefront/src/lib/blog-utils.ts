import type { BlogBody, BlogCategory, BlogPortableBlock, BlogPost } from "@/lib/sanity"

export const BLOG_CATEGORIES: BlogCategory[] = ["Protocols", "Analytical", "Compliance"]

export function blogImageForCategory(category?: BlogCategory) {
  switch (category) {
    case "Analytical":
      return "/v2/coa-preview.jpg"
    case "Compliance":
      return "/images/blog-hero.jpg"
    case "Protocols":
    default:
      return "/v2/blog-research.jpg"
  }
}

/** Prefer per-article cover image when set; otherwise fall back by category. */
export function blogImageForPost(post: Pick<BlogPost, "image" | "category">) {
  const image = post.image?.trim()
  if (image) {
    // Sanity CDN returns absolute https URLs; local fallbacks are public paths.
    return image
  }
  return blogImageForCategory(post.category)
}

export function formatReadTime(minutes?: number) {
  const value = minutes && minutes > 0 ? minutes : 5
  return `${value} min read`
}

/** True when updatedAt is at least a day after publishedAt — avoids showing a redundant "Updated" date on unedited articles. */
export function isMeaningfullyUpdated(publishedAt?: string, updatedAt?: string): boolean {
  if (!publishedAt || !updatedAt) return false
  const published = new Date(publishedAt).getTime()
  const updated = new Date(updatedAt).getTime()
  if (!Number.isFinite(published) || !Number.isFinite(updated)) return false
  return updated - published > 24 * 60 * 60 * 1000
}

export function getRelatedBlogPosts(posts: BlogPost[], current: BlogPost, limit = 3) {
  return posts
    .filter(
      (candidate) =>
        candidate.slug !== current.slug &&
        candidate.category &&
        current.category &&
        candidate.category === current.category
    )
    .slice(0, limit)
}

export type PlainBlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }

export function parsePlainBlogBlocks(body?: string): PlainBlogBlock[] {
  return (body || "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) return { type: "h2" as const, text: block.slice(3).trim() }
      if (block.startsWith("### ")) return { type: "h3" as const, text: block.slice(4).trim() }
      return { type: "p" as const, text: block }
    })
}

export function renderBlogParagraphs(body?: string) {
  return parsePlainBlogBlocks(body)
    .filter((block): block is PlainBlogBlock & { type: "p" } => block.type === "p")
    .map((block) => block.text)
}

export function isPortableBlogBody(body?: BlogBody): body is BlogPortableBlock[] {
  return Array.isArray(body)
}

export type BlogHeading = {
  id: string
  text: string
  level: 2 | 3
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function createHeadingIdFactory() {
  const used = new Map<string, number>()
  return (text: string) => {
    const base = slugifyHeading(text) || "section"
    const count = used.get(base) ?? 0
    used.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }
}

export function portableBlockPlainText(value: unknown): string {
  if (!value || typeof value !== "object") return ""
  const children = (value as { children?: unknown }).children
  if (!Array.isArray(children)) return ""
  return children
    .map((child) => {
      if (child && typeof child === "object" && "text" in child) {
        return String((child as { text?: unknown }).text || "")
      }
      return ""
    })
    .join("")
    .trim()
}

/** H2 headings used for in-article tables of contents. */
export function collectBlogHeadings(body?: BlogBody): BlogHeading[] {
  const nextId = createHeadingIdFactory()

  if (!body) return []

  if (!isPortableBlogBody(body)) {
    return parsePlainBlogBlocks(body)
      .filter((block): block is PlainBlogBlock & { type: "h2" } => block.type === "h2")
      .map((block) => ({
        id: nextId(block.text),
        text: block.text,
        level: 2 as const
      }))
  }

  const headings: BlogHeading[] = []
  for (const block of body) {
    if (block?._type !== "block" || block.style !== "h2") continue
    const text = portableBlockPlainText(block)
    if (!text) continue
    headings.push({ id: nextId(text), text, level: 2 })
  }
  return headings
}

/** Unique Medusa handles referenced by productEmbed blocks in a Portable Text body. */
export function collectProductEmbedHandles(body?: BlogBody): string[] {
  if (!isPortableBlogBody(body)) return []
  const handles = new Set<string>()
  for (const block of body) {
    if (block?._type === "productEmbed" && typeof block.handle === "string") {
      const handle = block.handle.trim()
      if (handle) handles.add(handle)
    }
  }
  return [...handles]
}
