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
  if (post.image?.trim()) return post.image.trim()
  return blogImageForCategory(post.category)
}

export function formatReadTime(minutes?: number) {
  const value = minutes && minutes > 0 ? minutes : 5
  return `${value} min read`
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
