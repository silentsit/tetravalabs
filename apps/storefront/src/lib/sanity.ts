export type BlogPost = {
  title: string
  slug: string
  excerpt?: string
  body?: string
  publishedAt?: string
}

const fallbackPosts: BlogPost[] = [
  {
    title: "RUO Handling and Storage Basics",
    slug: "ruo-handling-and-storage-basics",
    excerpt: "Storage, reconstitution, and handling best practices for peptide research materials.",
    publishedAt: "2026-05-15T00:00:00.000Z",
    body:
      "Research-use-only peptides should be stored lyophilized at -20°C until reconstitution. Limit freeze-thaw cycles and document batch IDs for every vial used in a study.\n\n" +
      "After reconstitution, use bacteriostatic water or the appropriate solvent noted on the product label. Label vials with compound, concentration, and date opened. Most reconstituted materials are stable for a limited window at 2–8°C — follow your lab SOP.\n\n" +
      "Always cross-reference the batch COA in our COA Library before starting an experiment."
  },
  {
    title: "How to Read COA and HPLC Reports",
    slug: "how-to-read-coa-and-hplc-reports",
    excerpt: "A practical guide to interpreting purity and analytical outputs.",
    publishedAt: "2026-05-20T00:00:00.000Z",
    body:
      "A Certificate of Analysis (COA) confirms identity and purity for a specific batch. Look for batch number, test date, and reported purity percentage.\n\n" +
      "HPLC chromatograms show peak area for the target compound versus impurities. A single dominant peak near the expected retention time with minimal secondary peaks generally indicates higher purity.\n\n" +
      "Compare COA and HPLC documents together — COA summarizes acceptance criteria while HPLC provides the underlying chromatographic evidence."
  },
  {
    title: "Semaglutide Storage Protocols for Research Labs",
    slug: "semaglutide-storage-protocols",
    excerpt: "Cold-chain and lyophilized storage guidance for GLP-1 research materials.",
    publishedAt: "2026-06-01T00:00:00.000Z",
    body:
      "GLP-1 receptor agonist peptides are sensitive to heat and repeated moisture exposure. Keep lyophilized vials sealed until use and store at -20°C.\n\n" +
      "Reconstitute only the amount required for the current experimental window. Avoid agitation that introduces foaming, and use low-bind pipette tips for accurate volumetric work.\n\n" +
      "Document the batch COA ID in your lab notebook — Tetrava publishes batch-level documents for every catalog SKU in the COA Library."
  }
]

async function fetchSanity<T>(query: string): Promise<T | null> {
  const projectId = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET
  const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01"

  if (!projectId || !dataset) return null

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set("query", query)

  try {
    const response = await fetch(url.toString(), { next: { revalidate: 600 } })
    if (!response.ok) return null
    const json = await response.json()
    return (json.result || null) as T | null
  } catch {
    return null
  }
}

export async function listBlogPosts(): Promise<BlogPost[]> {
  const query =
    '*[_type == "researchArticle"] | order(publishedAt desc){title,"slug":slug.current,excerpt,publishedAt}'
  const posts = await fetchSanity<BlogPost[]>(query)
  if (!posts || posts.length === 0) return fallbackPosts
  return posts
}

function sanitizeSlug(slug: string) {
  return slug.replace(/[^a-z0-9-]/gi, "")
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const safeSlug = sanitizeSlug(slug)
  if (!safeSlug) return null

  const query = `*[_type == "researchArticle" && slug.current == "${safeSlug}"][0]{title,"slug":slug.current,excerpt,body,publishedAt}`
  const post = await fetchSanity<BlogPost>(query)
  if (!post) return fallbackPosts.find((item) => item.slug === safeSlug) || null
  return post
}
