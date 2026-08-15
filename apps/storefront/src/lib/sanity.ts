/**
 * Outage-resilience fallback ONLY. Every article currently in this file also exists as the
 * live, canonical `researchArticle` document in Sanity. It is served here only when a Sanity
 * fetch fails outright (see `fetchSanity`'s catch-all below) or the article is missing from
 * Sanity entirely.
 *
 * Do NOT edit article content here expecting it to appear on the site — Sanity always wins
 * when it's reachable. If you edit an article, edit it in Sanity Studio (or via the Sanity
 * MCP tools) and publish it there. Only touch this file to keep the emergency copy from going
 * too stale, or to add a brand-new article that hasn't been created in Sanity yet.
 */
import researchArticles from "@/data/research-articles.json"
import { normalizeCategorySlug } from "@/lib/categories"
import { KEPT_BLOG_SLUGS } from "@/lib/retired-blog-slugs"

export type BlogCategory = "Protocols" | "Analytical" | "Compliance"

export type BlogReference = {
  _key?: string
  title?: string
  authors?: string
  publication?: string
  year?: string
  url?: string
  /** When set, overrides the auto-built citation line. */
  citationText?: string
}

/** Sanity Portable Text block or custom productEmbed object. */
export type BlogPortableBlock = {
  _type: string
  _key?: string
  handle?: string
  cardVariant?: "shop" | "featured" | "default"
  [key: string]: unknown
}

export type BlogBody = string | BlogPortableBlock[]

export type BlogVideo = {
  youtubeId: string
  title?: string
  description?: string
  /** Name of the on-screen presenter, when the video is not authored by Tetrava (shown in the caption, never as the article byline). */
  presenter?: string
  /** ISO 8601 date the source video was uploaded, when known. */
  uploadDate?: string
  /** Optional thumbnail override; defaults to the YouTube-hosted thumbnail. */
  thumbnail?: string
}

export type BlogPost = {
  title: string
  slug: string
  excerpt?: string
  /** SERP title override. Falls back to `title` when omitted. */
  seoTitle?: string
  /** SERP description override. Falls back to `excerpt` when omitted. */
  seoDescription?: string
  /** Page-specific meta keywords. Falls back to site defaults when omitted. */
  keywords?: string[]
  body?: BlogBody
  category?: BlogCategory
  readTimeMinutes?: number
  publishedAt?: string
  /** Last substantive edit date (dateModified). Sourced from Sanity's `_updatedAt` when live, or the JSON seed field when using the fallback. */
  updatedAt?: string
  /** Optional cover image path under /public (e.g. /images/blog/…). */
  image?: string
  references?: BlogReference[]
  /** When set, the article renders a responsive YouTube embed instead of the image hero. */
  video?: BlogVideo
}

export type CategorySeoBlock = {
  categorySlug: string
  introCopy: string
  supportingCopy?: string
  seoTitle?: string
  seoDescription?: string
}

export type LegalPageContent = {
  type: string
  content: string
  version?: string
  publishedAt?: string
}

/** See the outage-resilience-fallback note on the `research-articles.json` import above. */
const fallbackPosts = researchArticles as BlogPost[]

const fallbackCategorySeo: CategorySeoBlock[] = [
  {
    categorySlug: "glp-1-research",
    introCopy:
      "GLP-1 and incretin research peptides for laboratory investigation of metabolic pathways, appetite signaling, and glucose regulation models.",
    supportingCopy:
      "All compounds ship lyophilized with lot-linked COA and HPLC documentation. Store at -20°C until reconstitution per your lab SOP."
  },
  {
    categorySlug: "tissue-repair",
    introCopy:
      "BPC-157, TB-500, GHK-Cu, and related tissue-repair research peptides for in-vitro and animal model studies.",
    supportingCopy:
      "Batch purity is verified by HPLC-MS. Cross-reference the COA Library before starting any experiment."
  },
  {
    categorySlug: "growth-hormone-axis",
    introCopy:
      "CJC-1295, Ipamorelin, GHRP-class secretagogues, sermorelin, and tesamorelin for growth hormone axis research models.",
    supportingCopy:
      "Lyophilized powders with independent HPLC verification. Cold-chain shipping available. For qualified laboratory research only."
  },
  {
    categorySlug: "longevity-neuropeptides",
    introCopy:
      "Longevity and neuropeptide research compounds including epithalon, selank, semax, and thymic peptides.",
    supportingCopy:
      "Lot-linked analytical documentation supports reproducible experimental design."
  },
  {
    categorySlug: "metabolic-mitochondrial",
    introCopy:
      "Mitochondrial and metabolic research peptides including MOTS-c, NAD+, glutathione, and related cofactors.",
    supportingCopy:
      "Verify storage requirements on each product specification tab before use."
  },
  {
    categorySlug: "research-blends",
    introCopy:
      "Multi-peptide research blends formulated for studies that require combined compound profiles in a single vial.",
    supportingCopy:
      "Each blend SKU includes variant-level COA documentation where published. Verify batch IDs before use."
  },
  {
    categorySlug: "lab-supplies",
    introCopy:
      "BAC water, acetic acid, and reconstitution supplies required for peptide preparation in the lab.",
    supportingCopy:
      "Pair with your peptide order to streamline reconstitution workflows."
  }
]

const blogFields = `title,"slug":slug.current,excerpt,body,category,readTimeMinutes,publishedAt,"updatedAt":_updatedAt,"image":image.asset->url,seoTitle,seoDescription,keywords,references[]{_key,title,authors,publication,year,url,citationText},video{youtubeId,title,description,presenter,uploadDate,thumbnail}`

async function fetchSanity<T>(query: string, tags?: string[]): Promise<T | null> {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01"

  if (!projectId || !dataset) return null

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set("query", query)

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 600, tags: tags || ["sanity"] }
    })
    if (!response.ok) return null
    const json = await response.json()
    return (json.result || null) as T | null
  } catch {
    return null
  }
}

function sanitizeSlug(slug: string) {
  return slug.replace(/[^a-z0-9-]/gi, "")
}

/** Prefer published Sanity Portable Text; fall back to JSON seed when CMS body is empty or legacy plain text. */
function resolveBlogBody(primary?: BlogBody, fallback?: BlogBody): BlogBody | undefined {
  if (Array.isArray(primary) && primary.length > 0) return primary
  if (Array.isArray(fallback) && fallback.length > 0) return fallback

  const primaryText = typeof primary === "string" ? primary.trim() : ""
  const fallbackText = typeof fallback === "string" ? fallback.trim() : ""

  // Legacy seeded Sanity bodies were stored as plain strings; prefer JSON fallback updates.
  if (primaryText && fallbackText) return fallback
  if (primaryText) return primary
  if (fallbackText) return fallback

  return primary ?? fallback
}

/** Prefer CMS video when present; always backfill uploadDate for Google VideoObject. */
function resolveBlogVideo(
  cmsVideo: BlogPost["video"] | undefined,
  fallbackVideo: BlogPost["video"] | undefined,
  publishedAt?: string
): BlogPost["video"] | undefined {
  const primary = cmsVideo?.youtubeId ? cmsVideo : undefined
  const fallback = fallbackVideo?.youtubeId ? fallbackVideo : undefined
  const base = primary || fallback
  if (!base?.youtubeId) return undefined

  const uploadDate =
    primary?.uploadDate?.trim() ||
    fallback?.uploadDate?.trim() ||
    publishedAt?.trim() ||
    undefined

  return {
    ...(fallback || {}),
    ...base,
    youtubeId: base.youtubeId,
    ...(uploadDate ? { uploadDate } : {})
  }
}

/** Prefer repo-hosted cover art over Sanity CDN URLs for stable blog hero delivery. */
function resolveBlogImage(cmsImage?: string | null, fallbackImage?: string | null): string | undefined {
  const fallback = fallbackImage?.trim()
  const cms = cmsImage?.trim()
  if (fallback?.startsWith("/")) return fallback
  if (cms) return cms
  return fallback || undefined
}

function normalizePosts(posts: BlogPost[] | null): BlogPost[] {
  if (!posts?.length) return fallbackPosts

  const fallbackBySlug = new Map(fallbackPosts.map((post) => [post.slug, post]))
  const merged: BlogPost[] = posts.map((post) => {
    const fallback = fallbackBySlug.get(post.slug)
    return {
      ...post,
      readTimeMinutes: post.readTimeMinutes || 5,
      body: resolveBlogBody(post.body, fallback?.body),
      image: resolveBlogImage(post.image, fallback?.image),
      references: post.references?.length ? post.references : fallback?.references,
      video: resolveBlogVideo(post.video, fallback?.video, post.publishedAt || fallback?.publishedAt),
      seoTitle: post.seoTitle || fallback?.seoTitle,
      seoDescription: post.seoDescription || fallback?.seoDescription,
      keywords: post.keywords?.length ? post.keywords : fallback?.keywords,
      updatedAt: post.updatedAt || fallback?.updatedAt || post.publishedAt
    }
  })

  // Append JSON fallbacks missing from Sanity (slug-level merge, not count-based).
  const slugs = new Set(merged.map((post) => post.slug))
  for (const fallback of fallbackPosts) {
    if (!slugs.has(fallback.slug)) merged.push(fallback)
  }
  if (merged.length !== posts.length) {
    merged.sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    )
  }

  const keep = new Set<string>(KEPT_BLOG_SLUGS)
  return merged.filter((post) => keep.has(post.slug))
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "researchArticle"] | order(publishedAt desc){${blogFields}}`
  return normalizePosts(await fetchSanity<BlogPost[]>(query, ["sanity:blog"]))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const safeSlug = sanitizeSlug(slug)
  if (!safeSlug) return null
  if (!(KEPT_BLOG_SLUGS as readonly string[]).includes(safeSlug)) return null

  const query = `*[_type == "researchArticle" && slug.current == "${safeSlug}"][0]{${blogFields}}`
  const post = await fetchSanity<BlogPost>(query, [`sanity:blog:${safeSlug}`])
  if (!post) return fallbackPosts.find((item) => item.slug === safeSlug) || null
  const fallback = fallbackPosts.find((item) => item.slug === safeSlug)
  return {
    ...post,
    readTimeMinutes: post.readTimeMinutes || 5,
    body: resolveBlogBody(post.body, fallback?.body),
    image: resolveBlogImage(post.image, fallback?.image),
    references: post.references?.length ? post.references : fallback?.references,
    video: resolveBlogVideo(post.video, fallback?.video, post.publishedAt || fallback?.publishedAt),
    seoTitle: post.seoTitle || fallback?.seoTitle,
    seoDescription: post.seoDescription || fallback?.seoDescription,
    keywords: post.keywords?.length ? post.keywords : fallback?.keywords,
    updatedAt: post.updatedAt || fallback?.updatedAt || post.publishedAt
  }
}

export async function getCategorySeoBlock(slug: string): Promise<CategorySeoBlock | null> {
  const safeSlug = sanitizeSlug(slug)
  if (!safeSlug) return null

  const normalized = String(normalizeCategorySlug(safeSlug))

  const query = `*[_type == "categorySeoBlock" && categorySlug == "${normalized}"][0]{
    categorySlug, introCopy, supportingCopy, seoTitle, seoDescription
  }`
  const block = await fetchSanity<CategorySeoBlock>(query, [`sanity:category:${normalized}`])
  if (block) return block
  return fallbackCategorySeo.find((item) => item.categorySlug === normalized) || null
}

const legalPaths: Record<string, string> = {
  terms: "/terms",
  privacy: "/privacy",
  refund: "/refund",
  ruo: "/ruo"
}

export function legalPathForType(type: string) {
  return legalPaths[type] || null
}

export async function getLegalPage(type: string): Promise<LegalPageContent | null> {
  const safeType = type.replace(/[^a-z]/gi, "")
  if (!safeType) return null

  const query = `*[_type == "legalPage" && type == "${safeType}"][0]{
    type, content, version, publishedAt
  }`
  return fetchSanity<LegalPageContent>(query, [`sanity:legal:${safeType}`])
}

export function renderLegalParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}
