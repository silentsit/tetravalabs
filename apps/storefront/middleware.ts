import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isRestrictedCountry } from "@/lib/shipping-compliance"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublicPath =
    pathname.startsWith("/ruo") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")

  if (isPublicPath) return withSecurityHeaders(NextResponse.next())

  const ruoCookie = req.cookies.get("tetrava_ruo_ack")?.value
  if (ruoCookie !== "v1") {
    const url = req.nextUrl.clone()
    url.pathname = "/ruo"
    return withSecurityHeaders(NextResponse.redirect(url))
  }

  if (pathname.startsWith("/checkout")) {
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null
    if (country && isRestrictedCountry(country)) {
      const url = req.nextUrl.clone()
      url.pathname = "/shipping-restricted"
      return withSecurityHeaders(NextResponse.redirect(url))
    }
  }

  return withSecurityHeaders(NextResponse.next())
}

function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
