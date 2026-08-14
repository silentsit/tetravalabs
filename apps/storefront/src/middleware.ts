import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { acceptPrefersMarkdown, isMarkdownEligiblePath } from "@/lib/agent-markdown/negotiation"

/** RFC 8288 discovery pointers for AI agents (api-catalog, auth, sitemap, llms). */
const AGENT_DISCOVERY_LINK = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</auth.md>; rel="describedby"; type="text/markdown"',
  '</sitemap_index.xml>; rel="sitemap"',
  '</sitemap.md>; rel="sitemap"; type="text/markdown"',
  '</llms.txt>; rel="alternate"; type="text/plain"'
].join(", ")

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.append("Link", AGENT_DISCOVERY_LINK)
  return response
}

/** Content negotiation per page: tells caches the response varies on Accept, and points agents at the markdown mirror. */
function withMarkdownDiscovery(response: NextResponse, pathname: string) {
  response.headers.append("Vary", "Accept")
  response.headers.append("Link", `<${pathname}>; rel="alternate"; type="text/markdown"`)
  return response
}

function isSearchCrawler(userAgent: string | null) {
  if (!userAgent) return false
  return /Googlebot|Google-InspectionTool|bingbot|BingPreview|Slurp|DuckDuckBot|Baiduspider|YandexBot|Yandex|Applebot|facebookexternalhit/i.test(
    userAgent
  )
}

function withShopFilterRobots(request: NextRequest, response: NextResponse) {
  if (request.nextUrl.pathname !== "/shop") return response
  if ([...request.nextUrl.searchParams.keys()].length > 0) {
    response.headers.set("X-Robots-Tag", "noindex, follow")
  }
  return response
}

function finalize(request: NextRequest, response: NextResponse) {
  response.headers.set("x-pathname", request.nextUrl.pathname)
  withSecurityHeaders(response)
  withShopFilterRobots(request, response)
  if (isMarkdownEligiblePath(request.nextUrl.pathname)) {
    withMarkdownDiscovery(response, request.nextUrl.pathname)
  }
  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only HTTP redirect in the storefront: /blog/ → /blog (and the same for every other path).
  // skipTrailingSlashRedirect keeps Next.js from emitting its default 308. Use WHATWG URL —
  // NextURL.clone() preserves the incoming trailing slash and would 301-loop.
  if (pathname.length > 1 && pathname.endsWith("/")) {
    const url = new URL(request.url)
    url.pathname = pathname.replace(/\/+$/, "") || "/"
    return finalize(request, NextResponse.redirect(url, 301))
  }

  if (
    isMarkdownEligiblePath(pathname) &&
    acceptPrefersMarkdown(request.headers.get("accept")) &&
    !isSearchCrawler(request.headers.get("user-agent"))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = `/md-mirror${pathname === "/" ? "" : pathname}`
    const response = NextResponse.rewrite(url)
    // Middleware Link headers win over route-handler Link for rewrites, so set
    // the plan-required canonical pointer here (not only in md-mirror/route.ts).
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(
      /\/$/,
      ""
    )
    const canonical = pathname === "/" ? siteUrl : `${siteUrl}${pathname}`
    response.headers.append("Link", `<${canonical}>; rel="canonical"`)
    return finalize(request, response)
  }

  return finalize(request, NextResponse.next())
}

export const config = {
  matcher: [
    // Skip static asset extensions (incl. .md/.json so /auth.md and /openapi.json are not rewritten).
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|js|css|mjs|pdf|md|json)$).*)"
  ]
}
