import type { BlogCategory, BlogPost } from "@/lib/sanity"

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
