import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { acceptPrefersMarkdown, isMarkdownEligiblePath } from "@/lib/agent-markdown/negotiation"
import { canonicalizeCategorySlug } from "@/lib/category-url"
import { canonicalPathname } from "@/lib/canonical-path"

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

const SHOP_FILTER_QUERY_KEYS = new Set(["q", "category", "price_min", "price_max", "sort"])

function withShopFilterRobots(request: NextRequest, response: NextResponse) {
  const path = request.nextUrl.pathname
  if (path !== "/shop" && !path.startsWith("/category/")) return response
  const hasFilter = [...request.nextUrl.searchParams.keys()].some((key) =>
    SHOP_FILTER_QUERY_KEYS.has(key)
  )
  if (hasFilter) {
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

/**
 * One-hop 301 with an absolute Location.
 * Next/Vercel rewrites same-origin redirects to `/path`, which Googlebot
 * reports as "Redirect error". Force https off localhost so HTTP crawls
 * do not hop to another http URL.
 */
function redirect301(
  request: NextRequest,
  pathname: string,
  searchParams: URLSearchParams,
  hostname?: string
) {
  const url = new URL(request.url)
  if (hostname) url.hostname = hostname
  const host = url.hostname.toLowerCase()
  if (host !== "localhost" && host !== "127.0.0.1") {
    url.protocol = "https:"
  }
  url.pathname = pathname
  url.search = searchParams.toString() ? `?${searchParams.toString()}` : ""
  return new NextResponse(null, {
    status: 301,
    headers: { Location: url.toString() }
  })
}

function apexHostname(hostHeader: string | null): string | null {
  const hostname = (hostHeader || "").split(":")[0]
  if (!hostname.toLowerCase().startsWith("www.")) return null
  if (hostname.toLowerCase() === "www.localhost") return null
  return hostname.slice(4)
}

/**
 * Canonicalize equivalent URLs in one hop:
 * www → apex, trailing slash, leftover ?strength=/?pack=,
 * /shop?category= → /category/{slug}, legacy product/category paths.
 */
function canonicalRedirect(request: NextRequest) {
  const incoming = new URL(request.url)
  const apex = apexHostname(request.headers.get("host") || incoming.host)
  let pathname = incoming.pathname
  const params = new URLSearchParams(incoming.search)

  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.replace(/\/+$/, "") || "/"
  }

  for (const [key, value] of [...params.entries()]) {
    if (!value.trim()) params.delete(key)
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
        }
      }
    }
  }

  const aliased = canonicalPathname(pathname)
  if (aliased) pathname = aliased

  const nextSearch = params.toString()
  const incomingSearch = incoming.search.startsWith("?") ? incoming.search.slice(1) : incoming.search
  if (!apex && pathname === incoming.pathname && nextSearch === incomingSearch) return null
  return redirect301(request, pathname, params, apex || undefined)
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
