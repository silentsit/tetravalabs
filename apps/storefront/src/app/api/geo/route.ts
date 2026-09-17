import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const country =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country-code") ||
    null

  return NextResponse.json(
    {
      ok: true,
      country: country?.toUpperCase() || null
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60",
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  )
}
