import { createSign } from "node:crypto"

export type SearchConsoleResult = {
  ok: boolean
  skipped?: boolean
  status?: number
  message?: string
}

type ServiceAccount = {
  client_email?: string
  private_key?: string
}

function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

function gscSiteUrl() {
  const raw = (process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || `${siteOrigin()}/`).trim()
  return raw.endsWith("/") ? raw : `${raw}/`
}

function sitemapFeedUrl() {
  return (process.env.GOOGLE_SEARCH_CONSOLE_SITEMAP_URL || `${siteOrigin()}/sitemap_index.xml`).trim()
}

function parseServiceAccount(): ServiceAccount | null {
  const raw = process.env.GOOGLE_SEARCH_CONSOLE_JSON?.trim()
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as ServiceAccount
    if (!parsed.client_email || !parsed.private_key) return null
    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key.replace(/\\n/g, "\n")
    }
  } catch {
    return null
  }
}

export function isSearchConsoleConfigured() {
  return Boolean(parseServiceAccount())
}

function base64UrlJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url")
}

async function googleAccessToken(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${base64UrlJson({ alg: "RS256", typ: "JWT" })}.${base64UrlJson({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/webmasters",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  })}`
  const signer = createSign("RSA-SHA256")
  signer.update(unsigned)
  const jwt = `${unsigned}.${signer.sign(account.private_key!, "base64url")}`

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt
    })
  })
  const data = (await response.json()) as { access_token?: string; error?: string }
  if (!response.ok || !data.access_token) {
    throw new Error(data.error || `Google OAuth HTTP ${response.status}`)
  }
  return data.access_token
}

/** Resubmit sitemap_index.xml in Search Console. No-ops without a service account. */
export async function submitSearchConsoleSitemap(): Promise<SearchConsoleResult> {
  const account = parseServiceAccount()
  if (!account) {
    return { ok: true, skipped: true, message: "GOOGLE_SEARCH_CONSOLE_JSON not set" }
  }

  try {
    const token = await googleAccessToken(account)
    const site = encodeURIComponent(gscSiteUrl())
    const feed = encodeURIComponent(sitemapFeedUrl())
    const response = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${site}/sitemaps/${feed}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    const ok = response.status === 200 || response.status === 204
    return {
      ok,
      status: response.status,
      message: ok ? undefined : `Search Console HTTP ${response.status}`
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Search Console request failed"
    }
  }
}
