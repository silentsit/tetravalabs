import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const restrictedCountries = new Set(
  (process.env.RESTRICTED_COUNTRIES || "")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)
)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublicPath =
    pathname.startsWith("/ruo") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api")

  if (isPublicPath) return NextResponse.next()

  const ruoCookie = req.cookies.get("tetrava_ruo_ack")?.value
  if (ruoCookie !== "v1") {
    const url = req.nextUrl.clone()
    url.pathname = "/ruo"
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith("/checkout")) {
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      null
    if (country && restrictedCountries.has(country)) {
      const url = req.nextUrl.clone()
      url.pathname = "/shipping-restricted"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}
