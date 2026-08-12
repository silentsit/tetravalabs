import { NextResponse } from "next/server"
import { resolveMarkdownForPath } from "@/lib/agent-markdown/router"
import { absoluteUrlForPath } from "@/lib/agent-markdown/shared"

export const revalidate = 3600

type Params = { path?: string[] }

/**
 * Internal-only markdown mirror handler. Reached exclusively via the `Accept: text/markdown`
 * rewrite in `middleware.ts` — never linked publicly, so it stays out of sitemaps/robots.
 *
 * Named `md-mirror` (not `_markdown`/`__markdown`) because Next.js treats any App Router
 * folder starting with `_` as a private, unroutable folder.
 */
export async function GET(_request: Request, { params }: { params: Promise<Params> }) {
  const { path } = await params
  const segments = path || []
  const pathname = segments.length ? `/${segments.join("/")}` : "/"

  const page = await resolveMarkdownForPath(pathname)
  if (!page) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" }
    })
  }

  return new NextResponse(page.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      Link: `<${absoluteUrlForPath(pathname)}>; rel="canonical"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    }
  })
}
