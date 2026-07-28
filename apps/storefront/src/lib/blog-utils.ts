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

export function renderBlogParagraphs(body?: string) {
  return (body || "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
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
