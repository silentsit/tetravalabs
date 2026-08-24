import { NextResponse } from "next/server"
import { notifySearchEngines } from "@/lib/notify-search-engines"

export const runtime = "nodejs"
export const maxDuration = 60

function cronAuthorized(req: Request) {
  const expected = (process.env.CRON_SECRET || process.env.REVALIDATE_SECRET || "").trim()
  if (!expected) return false
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || ""
  const header = req.headers.get("x-revalidate-secret") || ""
  return bearer === expected || header === expected
}

async function run(req: Request) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }
  const result = await notifySearchEngines()
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}

export async function GET(req: Request) {
  return run(req)
}

export async function POST(req: Request) {
  return run(req)
}
