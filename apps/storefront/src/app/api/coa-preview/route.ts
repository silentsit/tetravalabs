import { NextResponse } from "next/server"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const COA_ID_PATTERN = /^[a-zA-Z0-9_-]+$/

/**
 * GET /api/coa-preview?id=<document_id>
 * Same-origin proxy for pre-generated COA card thumbnails.
 */
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id")?.trim()
  if (!id || !COA_ID_PATTERN.test(id)) {
    return NextResponse.json({ message: "Document id is required" }, { status: 400 })
  }

  const upstream = await fetch(`${MEDUSA_URL}/store/coas/${encodeURIComponent(id)}/preview`, {
    headers: PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {},
    redirect: "follow"
  })

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "")
    console.error("[coa-preview] upstream failed", upstream.status, MEDUSA_URL, id, detail.slice(0, 200))
    return NextResponse.json({ message: "COA preview not found" }, { status: upstream.status })
  }

  const body = await upstream.arrayBuffer()
  const contentType = upstream.headers.get("content-type") || "image/jpeg"

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800"
    }
  })
}
