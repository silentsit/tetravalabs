import { NextResponse } from "next/server"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get("email")?.trim()
  const displayId = searchParams.get("display_id")?.trim()

  if (!email || !displayId) {
    return NextResponse.json({ ok: false, message: "email and display_id are required" }, { status: 400 })
  }

  const url = new URL(`${MEDUSA_URL}/store/orders/lookup`)
  url.searchParams.set("email", email)
  url.searchParams.set("display_id", displayId)

  const response = await fetch(url.toString(), {
    headers: {
      ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
    },
    cache: "no-store"
  })

  const data = await response.json()
  if (!response.ok) {
    return NextResponse.json({ ok: false, message: data.message || "Lookup failed" }, { status: response.status })
  }

  return NextResponse.json({ ok: true, order: data.order })
}
