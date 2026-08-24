import { isIndexNowConfigured, submitIndexNow, type IndexNowResult } from "@/lib/indexnow"
import {
  isSearchConsoleConfigured,
  submitSearchConsoleSitemap,
  type SearchConsoleResult
} from "@/lib/search-console"
import { getAllIndexableSitemapUrls } from "@/lib/sitemap-entries"

export type SearchEngineNotifyResult = {
  ok: boolean
  urlCount: number
  submittedAt: string
  indexNow: IndexNowResult
  searchConsole: SearchConsoleResult
}

export async function notifySearchEngines(): Promise<SearchEngineNotifyResult> {
  const urls = await getAllIndexableSitemapUrls()
  const indexNow = await submitIndexNow(urls)
  const searchConsole = await submitSearchConsoleSitemap()
  const ok = indexNow.ok || Boolean(indexNow.skipped)

  return {
    ok,
    urlCount: urls.length,
    submittedAt: new Date().toISOString(),
    indexNow,
    searchConsole
  }
}

export function searchEngineNotifyStatus() {
  return {
    indexNowConfigured: isIndexNowConfigured(),
    searchConsoleConfigured: isSearchConsoleConfigured()
  }
}
