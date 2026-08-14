import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { acceptPrefersMarkdown, isMarkdownEligiblePath } from "@/lib/agent-markdown/negotiation"
import { canonicalizeCategorySlug } from "@/lib/category-url"

const VARIANT_QUERY_KEYS = ["strength", "pack"] as const

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

/** One-hop 301 using WHATWG URL — NextURL.clone() re-adds trailing slashes and loops. */
function redirect301(request: NextRequest, pathname: string, searchParams: URLSearchParams) {
  const url = new URL(request.url)
  url.pathname = pathname
  url.search = searchParams.toString() ? `?${searchParams.toString()}` : ""
  return NextResponse.redirect(url, 301)
}

/**
 * Canonicalize equivalent URLs in one hop:
 * trailing slash, leftover ?strength=/?pack=, and /shop?category= → /category/{slug}.
 */
function canonicalRedirect(request: NextRequest) {
  const incoming = new URL(request.url)
  let pathname = incoming.pathname
  const params = new URLSearchParams(incoming.search)

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "") || "/"
  }

  for (const key of VARIANT_QUERY_KEYS) {
    params.delete(key)
  }

  if (pathname === "/shop") {
    const category = params.get("category")?.trim()
    const hasSearchOrPrice =
      Boolean(params.get("q")?.trim()) ||
      Boolean(params.get("price_min")?.trim()) ||
      Boolean(params.get("price_max")?.trim())
    if (category && !hasSearchOrPrice) {
      if (category === "all") {
        params.delete("category")
      } else {
        const canonical = canonicalizeCategorySlug(category)
        if (canonical) {
          pathname = `/category/${canonical}`
          params.delete("category")
          params.delete("sort")
        }
      }
    }
  }

  const nextSearch = params.toString()
  const incomingSearch = incoming.search.startsWith("?") ? incoming.search.slice(1) : incoming.search
  if (pathname === incoming.pathname && nextSearch === incomingSearch) return null
  return redirect301(request, pathname, params)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const canonical = canonicalRedirect(request)
  if (canonical) return finalize(request, canonical)

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
