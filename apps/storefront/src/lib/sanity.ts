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
    body: "Sanity is not connected yet, so this fallback article is shown from local code."
  },
  {
    title: "How to Read COA and HPLC Reports",
    slug: "how-to-read-coa-and-hplc-reports",
    excerpt: "A practical guide to interpreting purity and analytical outputs.",
    body: "Once Sanity is configured, this route will serve the authored article body."
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
