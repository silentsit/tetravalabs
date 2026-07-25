import { NextResponse } from "next/server"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(
  /\/$/,
  ""
)
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

/** Resolve reorder magic-link payload. Tokens stay valid until expires_at (multi-use). */
export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params
  if (!token?.trim()) {
    return NextResponse.json({ ok: false, message: "token is required" }, { status: 400 })
  }

  const url = new URL(`${MEDUSA_URL}/store/orders/reorder-token`)
  url.searchParams.set("token", token)

  const response = await fetch(url.toString(), {
    headers: {
      ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {})
    },
    cache: "no-store"
  })
  const data = await response.json()
  if (!response.ok || !data.ok) {
    return NextResponse.json(
      { ok: false, message: data.message || "Invalid reorder link" },
      { status: response.status || 404 }
    )
  }

  return NextResponse.json({
    ok: true,
    order_id: data.order_id,
    items: data.items || []
  })
}
