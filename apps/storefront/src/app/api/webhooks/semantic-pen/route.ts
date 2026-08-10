import { NextRequest, NextResponse } from "next/server"
import {
  contentToPortableText,
  estimateReadTimeMinutes,
  slugifyTitle
} from "@/lib/html-to-portable-text"
import { getSanityWriteClient, getSanityWriteConfig, uploadImageFromUrl } from "@/lib/sanity-write"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const CATEGORIES = new Set(["Protocols", "Analytical", "Compliance"])

type LoosePayload = Record<string, unknown>

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
}

function authorize(req: NextRequest) {
  const expected = process.env.SEMANTIC_PEN_WEBHOOK_SECRET?.trim()
  if (!expected) return false

  const bearer = req.headers.get("authorization")
  if (bearer?.toLowerCase().startsWith("bearer ")) {
    if (bearer.slice(7).trim() === expected) return true
  }

  const headerSecret =
    req.headers.get("x-semantic-pen-secret") ||
    req.headers.get("x-webhook-secret") ||
    req.headers.get("x-revalidate-secret")
  return headerSecret === expected
}

function asString(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim()
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return undefined
}

function pickString(obj: LoosePayload, keys: string[]) {
  for (const key of keys) {
    const value = asString(obj[key])
    if (value) return value
  }
  return undefined
}

function unwrapPayload(raw: unknown): LoosePayload {
  if (!raw || typeof raw !== "object") return {}
  const obj = raw as LoosePayload
  // Zapier / Pabbly / nested wrappers
  for (const key of ["article", "data", "payload", "body", "result"]) {
    const nested = obj[key]
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return { ...obj, ...(nested as LoosePayload) }
    }
  }
  return obj
}

function resolveCategory(payload: LoosePayload): "Protocols" | "Analytical" | "Compliance" {
  const raw =
    pickString(payload, ["category", "categoryName", "blogCategory"]) ||
    (Array.isArray(payload.tags) ? asString(payload.tags[0]) : undefined) ||
    (Array.isArray(payload.tagNames) ? asString(payload.tagNames[0]) : undefined)

  if (!raw) return "Protocols"
  const normalized = raw.trim()
  if (CATEGORIES.has(normalized)) return normalized as "Protocols" | "Analytical" | "Compliance"
  const lower = normalized.toLowerCase()
  if (lower.includes("analy")) return "Analytical"
  if (lower.includes("compli") || lower.includes("legal") || lower.includes("ruo")) return "Compliance"
  return "Protocols"
}

function excerptFrom(payload: LoosePayload, bodyText: string) {
  const explicit = pickString(payload, [
    "excerpt",
    "metaDescription",
    "meta_description",
    "description",
    "summary"
  ])
  if (explicit) return explicit.slice(0, 320)
  const plain = bodyText.replace(/\s+/g, " ").trim()
  if (!plain) return undefined
  return plain.slice(0, 280) + (plain.length > 280 ? "…" : "")
}

function coverUrlFrom(payload: LoosePayload) {
  return (
    pickString(payload, [
      "featuredImage",
      "featured_image",
      "coverImage",
      "cover_image",
      "imageUrl",
      "image_url",
      "image"
    ]) || undefined
  )
}

/** Health / Semantic Pen URL probe */
export async function GET() {
  const { projectId, token } = getSanityWriteConfig()
  const secretConfigured = Boolean(process.env.SEMANTIC_PEN_WEBHOOK_SECRET?.trim())
  return NextResponse.json({
    ok: true,
    provider: "semantic-pen",
    mode: "draft-researchArticle",
    configured: Boolean(projectId && token && secretConfigured)
  })
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) return unauthorized()

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 })
  }

  const payload = unwrapPayload(raw)
  const title =
    pickString(payload, ["title", "articleTitle", "name", "headline"]) ||
    pickString(payload, ["targetKeyword", "target_keyword", "keyword"])

  const html =
    pickString(payload, [
      "articleHtml",
      "article_html",
      "content_html",
      "contentHtml",
      "html",
      "content",
      "body",
      "markdown",
      "articleMarkdown",
      "article_markdown"
    ]) || ""

  if (!title) {
    return NextResponse.json({ message: "Missing title (or targetKeyword)" }, { status: 400 })
  }
  if (!html.trim()) {
    return NextResponse.json(
      { message: "Missing article body (articleHtml / content / html)" },
      { status: 400 }
    )
  }

  const slug =
    slugifyTitle(
      pickString(payload, ["slug", "permalink", "urlSlug", "url_slug"]) || title
    ) || `article-${Date.now()}`

  const body = contentToPortableText(html)
  if (!body.length) {
    return NextResponse.json({ message: "Could not parse article body into blocks" }, { status: 400 })
  }

  const category = resolveCategory(payload)
  const bodyText = body.flatMap((b) => b.children.map((c) => c.text)).join(" ")
  const excerpt = excerptFrom(payload, bodyText)
  const readTimeMinutes = estimateReadTimeMinutes(body)
  const publishedAt =
    pickString(payload, ["publishedAt", "published_at", "date", "createdAt"]) ||
    new Date().toISOString()

  let client
  try {
    client = getSanityWriteClient()
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Sanity write client not configured" },
      { status: 503 }
    )
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "researchArticle" && slug.current == $slug][0]{_id}`,
    { slug }
  )

  const publishedId = existing?._id?.replace(/^drafts\./, "") || `researchArticle-${slug}`
  const draftId = `drafts.${publishedId}`

  let image: { _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined
  const coverUrl = coverUrlFrom(payload)
  if (coverUrl?.startsWith("http")) {
    try {
      image = await uploadImageFromUrl(coverUrl, `${slug}-cover`)
    } catch (error) {
      console.warn("[semantic-pen] cover upload skipped:", error)
    }
  }

  const doc = {
    _id: draftId,
    _type: "researchArticle" as const,
    title,
    slug: { _type: "slug" as const, current: slug },
    ...(excerpt ? { excerpt } : {}),
    category,
    readTimeMinutes,
    publishedAt,
    body,
    ...(image ? { image } : {})
  }

  await client.createOrReplace(doc)

  const studioHost =
    process.env.NEXT_PUBLIC_SANITY_STUDIO_URL?.replace(/\/$/, "") ||
    (process.env.SANITY_PROJECT_ID
      ? `https://${process.env.SANITY_PROJECT_ID}.sanity.studio`
      : null)

  return NextResponse.json({
    ok: true,
    draft: true,
    id: draftId,
    slug,
    title,
    category,
    readTimeMinutes,
    studioUrl: studioHost
      ? `${studioHost}/structure/researchArticle;${publishedId}`
      : undefined,
    previewPath: `/blog/${slug}`,
    note: "Saved as Sanity draft — publish in Studio after review. Not live on storefront until published."
  })
}
