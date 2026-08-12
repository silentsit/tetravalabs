import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { isRestrictedCountry } from "@/lib/shipping-compliance"

const VARIANT_QUERY_KEYS = ["strength", "pack"] as const

/** RFC 8288 discovery pointers for AI agents (api-catalog, auth, sitemap, llms). */
const AGENT_DISCOVERY_LINK = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/openapi+json"',
  '</auth.md>; rel="describedby"; type="text/markdown"',
  '</sitemap_index.xml>; rel="sitemap"',
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

function finalize(request: NextRequest, response: NextResponse) {
  response.headers.set("x-pathname", request.nextUrl.pathname)
  return withSecurityHeaders(response)
}

/** Strip legacy ?strength= / ?pack= so product URLs stay /{handle}. */
function stripVariantQueryParams(request: NextRequest) {
  const url = request.nextUrl.clone()
  let changed = false
  for (const key of VARIANT_QUERY_KEYS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key)
      changed = true
    }
  }
  if (!changed) return null
  return NextResponse.redirect(url, 301)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const cleaned = stripVariantQueryParams(request)
  if (cleaned) return finalize(request, cleaned)

  if (pathname.startsWith("/checkout")) {
    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      null
    if (country && isRestrictedCountry(country)) {
      const url = request.nextUrl.clone()
      url.pathname = "/shipping-restricted"
      return finalize(request, NextResponse.redirect(url))
    }
  }

  return finalize(request, NextResponse.next())
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|js|css|mjs|pdf)$).*)"
  ]
}
