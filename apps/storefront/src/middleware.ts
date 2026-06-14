import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { isRestrictedCountry } from "@/lib/shipping-compliance"

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return response
}

function finalize(request: NextRequest, response: NextResponse) {
  response.headers.set("x-pathname", request.nextUrl.pathname)
  return withSecurityHeaders(response)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

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
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|js|css)$).*)"
  ]
}
