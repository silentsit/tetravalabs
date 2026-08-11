/**
 * IndexNow client — notify participating search engines of URL add/update/delete.
 * Spec: https://www.indexnow.org/documentation
 *
 * Ownership: host `public/{INDEXNOW_KEY}.txt` containing the same key string.
 */

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"

function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

function indexNowKey(): string | null {
  const key = (process.env.INDEXNOW_KEY || "").trim()
  return key || null
}

/** Absolute https URL on this host, or null if invalid / off-host. */
export function toIndexNowUrl(pathOrUrl: string): string | null {
  const origin = siteOrigin()
  const host = new URL(origin).host
  let absolute: string
  try {
    absolute = pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")
      ? pathOrUrl
      : new URL(pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`, origin).toString()
  } catch {
    return null
  }
  try {
    const u = new URL(absolute)
    if (u.host !== host && u.host !== `www.${host}` && `www.${u.host}` !== host) {
      return null
    }
    u.hash = ""
    return u.toString()
  } catch {
    return null
  }
}

export type IndexNowResult = {
  ok: boolean
  skipped?: boolean
  status?: number
  submitted: number
  message?: string
}

/**
 * Submit one or many URLs to IndexNow (bulk POST, max 10,000).
 * No-ops when INDEXNOW_KEY is unset (local/dev without config).
 */
export async function submitIndexNow(pathsOrUrls: string[]): Promise<IndexNowResult> {
  const key = indexNowKey()
  if (!key) {
    return { ok: true, skipped: true, submitted: 0, message: "INDEXNOW_KEY not set" }
  }

  const urls = Array.from(
    new Set(pathsOrUrls.map(toIndexNowUrl).filter((u): u is string => Boolean(u)))
  )
  if (!urls.length) {
    return { ok: false, submitted: 0, message: "No valid same-host URLs" }
  }

  const origin = siteOrigin()
  const host = new URL(origin).host.replace(/^www\./, "")

  const body = {
    host,
    key,
    keyLocation: `${origin}/${key}.txt`,
    urlList: urls.slice(0, 10_000),
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    })
    const ok = res.status === 200 || res.status === 202
    return {
      ok,
      status: res.status,
      submitted: body.urlList.length,
      message: ok ? undefined : `IndexNow HTTP ${res.status}`,
    }
  } catch (error) {
    return {
      ok: false,
      submitted: 0,
      message: error instanceof Error ? error.message : "IndexNow request failed",
    }
  }
}

/** Convenience: submit a single path or absolute URL. */
export async function submitIndexNowUrl(pathOrUrl: string): Promise<IndexNowResult> {
  return submitIndexNow([pathOrUrl])
}
