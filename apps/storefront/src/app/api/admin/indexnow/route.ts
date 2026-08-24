import { NextResponse } from "next/server"
import { notifySearchEngines, searchEngineNotifyStatus } from "@/lib/notify-search-engines"
import { requireStoreAdmin } from "@/lib/require-store-admin"
import { getAllIndexableSitemapUrls } from "@/lib/sitemap-entries"

export const runtime = "nodejs"
export const maxDuration = 60

async function adminOrError(req: Request) {
  const auth = await requireStoreAdmin(req)
  if (!auth.ok) {
    return {
      auth: null,
      error: NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
    }
  }
  return { auth, error: null }
}

export async function GET(req: Request) {
  const { error } = await adminOrError(req)
  if (error) return error

  const urls = await getAllIndexableSitemapUrls()
  const flags = searchEngineNotifyStatus()
  return NextResponse.json({
    ok: true,
    configured: flags.indexNowConfigured,
    searchConsoleConfigured: flags.searchConsoleConfigured,
    urlCount: urls.length
  })
}

export async function POST(req: Request) {
  const { error } = await adminOrError(req)
  if (error) return error

  const flags = searchEngineNotifyStatus()
  if (!flags.indexNowConfigured && !flags.searchConsoleConfigured) {
    return NextResponse.json(
      { ok: false, submitted: 0, message: "INDEXNOW_KEY is not set on this deployment." },
      { status: 503 }
    )
  }

  const result = await notifySearchEngines()
  return NextResponse.json({
    ok: result.ok,
    submitted: result.indexNow.submitted,
    urlCount: result.urlCount,
    submittedAt: result.submittedAt,
    status: result.indexNow.status,
    skipped: result.indexNow.skipped,
    message: result.ok
      ? undefined
      : result.indexNow.message || result.searchConsole.message,
    indexNow: result.indexNow,
    searchConsole: result.searchConsole
  })
}
