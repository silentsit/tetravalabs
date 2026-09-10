import { NextResponse } from "next/server"
import { requireStoreAdmin } from "@/lib/require-store-admin"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export async function GET(req: Request) {
  const auth = await requireStoreAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const status = new URL(req.url).searchParams.get("status") || "on_hold"
  const token = req.headers.get("authorization") || ""

  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/admin/invoices?status=${encodeURIComponent(status)}`,
      {
        headers: {
          ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
          Authorization: token
        },
        cache: "no-store"
      }
    )
    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: data?.message || "Unable to load invoices" },
        { status: response.status }
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to load invoices" }, { status: 503 })
  }
}

export async function POST(req: Request) {
  const auth = await requireStoreAdmin(req)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const body = (await req.json()) as { order_id?: string }
  const orderId = body.order_id?.trim()
  if (!orderId) {
    return NextResponse.json({ ok: false, message: "order_id is required" }, { status: 400 })
  }

  const token = req.headers.get("authorization") || ""

  try {
    const response = await fetch(`${MEDUSA_URL}/store/admin/invoices/mark-paid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {}),
        Authorization: token
      },
      body: JSON.stringify({ order_id: orderId }),
      cache: "no-store"
    })
    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: data?.message || "Unable to mark payment received" },
        { status: response.status }
      )
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to mark payment received" }, { status: 503 })
  }
}
