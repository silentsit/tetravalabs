import researchArticles from "@/data/research-articles.json"

export type BlogCategory = "Protocols" | "Analytical" | "Compliance"

export type BlogPost = {
  title: string
  slug: string
  excerpt?: string
  body?: string
  category?: BlogCategory
  readTimeMinutes?: number
  publishedAt?: string
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

const fallbackPosts = researchArticles as BlogPost[]

const fallbackCategorySeo: CategorySeoBlock[] = [
  {
    categorySlug: "glp-1-incretin",
    introCopy:
      "GLP-1 and incretin research peptides for laboratory investigation of metabolic pathways, appetite signaling, and glucose regulation models.",
    supportingCopy:
      "All compounds ship lyophilized with lot-linked COA and HPLC documentation. Store at -20°C until reconstitution per your lab SOP."
  },
  {
    categorySlug: "bpc-157-tb500",
    introCopy:
      "BPC-157 and TB-500 research peptides for in-vitro and animal model studies focused on tissue repair pathways.",
    supportingCopy:
      "Batch purity is verified by HPLC-MS. Cross-reference the COA Library before starting any experiment."
  },
  {
    categorySlug: "blends",
    introCopy:
      "Multi-peptide research blends formulated for studies that require combined compound profiles in a single vial.",
    supportingCopy:
      "Each blend SKU includes variant-level COA documentation where published. Verify batch IDs before use."
  },
  {
    categorySlug: "cjc-ipamorelin-ghrp",
    introCopy:
      "CJC-1295, Ipamorelin, and GHRP-class secretagogues for growth hormone axis research models.",
    supportingCopy:
      "Lyophilized powders with independent HPLC verification. For qualified laboratory research only."
  },
  {
    categorySlug: "growth-hormone-axis",
    introCopy:
      "Growth hormone axis peptides including sermorelin, tesamorelin, and related secretagogues for endocrine research.",
    supportingCopy:
      "Cold-chain shipping available. Store sealed vials at -20°C until reconstitution."
  },
  {
    categorySlug: "longevity-thymic-neuropeptides",
    introCopy:
      "Longevity and neuropeptide research compounds including epithalon, selank, semax, and thymic peptides.",
    supportingCopy:
      "Lot-linked analytical documentation supports reproducible experimental design."
  },
  {
    categorySlug: "cosmetic-copper-tanning",
    introCopy:
      "Copper peptide, melanotan, and related compounds for dermal and pigmentation pathway research.",
    supportingCopy:
      "RUO materials only — not for cosmetic or human application."
  },
  {
    categorySlug: "mitochondrial-metabolic-other",
    introCopy:
      "Mitochondrial and metabolic research peptides including NAD+, glutathione, and related cofactors.",
    supportingCopy:
      "Verify storage requirements on each product specification tab before use."
  },
  {
    categorySlug: "supplies-reconstitution",
    introCopy:
      "BAC water, acetic acid, and reconstitution supplies required for peptide preparation in the lab.",
    supportingCopy:
      "Pair with your peptide order to streamline reconstitution workflows."
  },
  {
    categorySlug: "vitamins-injectables",
    introCopy:
      "Injectable research vitamins and adjunct compounds for laboratory protocol support.",
    supportingCopy:
      "For research use only. Review COA documentation for each batch before administration in models."
  }
]

const blogFields = `title,"slug":slug.current,excerpt,body,category,readTimeMinutes,publishedAt`

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

function normalizePosts(posts: BlogPost[] | null): BlogPost[] {
  if (!posts?.length) return fallbackPosts

  const merged: BlogPost[] = posts.map((post) => ({
    ...post,
    readTimeMinutes: post.readTimeMinutes || 5
  }))

  // If Sanity has fewer docs than local fallbacks, append missing slugs for dev/preview.
  if (merged.length < fallbackPosts.length) {
    const slugs = new Set(merged.map((post) => post.slug))
    for (const fallback of fallbackPosts) {
      if (!slugs.has(fallback.slug)) merged.push(fallback)
    }
    merged.sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    )
  }

  return merged
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const query = `*[_type == "researchArticle"] | order(publishedAt desc){${blogFields}}`
  return normalizePosts(await fetchSanity<BlogPost[]>(query, ["sanity:blog"]))
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const safeSlug = sanitizeSlug(slug)
  if (!safeSlug) return null

  const query = `*[_type == "researchArticle" && slug.current == "${safeSlug}"][0]{${blogFields}}`
  const post = await fetchSanity<BlogPost>(query, [`sanity:blog:${safeSlug}`])
  if (!post) return fallbackPosts.find((item) => item.slug === safeSlug) || null
  return { ...post, readTimeMinutes: post.readTimeMinutes || 5 }
}

export async function getCategorySeoBlock(slug: string): Promise<CategorySeoBlock | null> {
  const safeSlug = sanitizeSlug(slug)
  if (!safeSlug) return null

  const query = `*[_type == "categorySeoBlock" && categorySlug == "${safeSlug}"][0]{
    categorySlug, introCopy, supportingCopy, seoTitle, seoDescription
  }`
  const block = await fetchSanity<CategorySeoBlock>(query, [`sanity:category:${safeSlug}`])
  if (block) return block
  return fallbackCategorySeo.find((item) => item.categorySlug === safeSlug) || null
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
