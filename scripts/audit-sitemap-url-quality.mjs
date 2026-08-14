const baseUrl = (process.argv[2] || process.env.SITEMAP_AUDIT_URL || "").replace(/\/$/, "")
const maxUrls = Number(process.env.SITEMAP_AUDIT_LIMIT || 250)
const concurrency = Number(process.env.SITEMAP_AUDIT_CONCURRENCY || 8)
const googlebot = "Googlebot/2.1 (+http://www.google.com/bot.html)"

if (!baseUrl) {
  console.error("Usage: npm run audit:sitemap -- https://example.com")
  process.exit(1)
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) => match[1].trim())
}

function normalizeUrl(value) {
  const url = new URL(value)
  url.hash = ""
  url.search = ""
  return url.toString().replace(/\/$/, "")
}

async function request(url) {
  return fetch(url, {
    redirect: "manual",
    headers: { "user-agent": googlebot }
  })
}

function getCanonical(html) {
  const match = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i)
  return match?.[1] || null
}

function hasNoindex(html, headers) {
  if (/\bx-robots-tag\b/i.test(headers) && /\bnoindex\b/i.test(headers)) return true
  return /<meta\b(?=[^>]*\bname=["'](?:robots|googlebot)["'])[^>]*\bcontent=["'][^"']*\bnoindex\b/i.test(
    html
  )
}

function hasTitle(html) {
  return /<title>\s*\S[\s\S]*?<\/title>/i.test(html)
}

function hasH1(html) {
  return /<h1\b[^>]*>\s*\S[\s\S]*?<\/h1>/i.test(html)
}

async function mapWithConcurrency(items, fn) {
  const results = []
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await fn(items[index])
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
  return results
}

async function getSitemapUrls() {
  const sitemapUrl = `${baseUrl}/sitemap.xml`
  const sitemap = await request(sitemapUrl)
  if (sitemap.status !== 200) {
    throw new Error(`${sitemapUrl} returned ${sitemap.status}; sitemaps must return 200 without redirects`)
  }

  const xml = await sitemap.text()
  const childSitemaps = extractLocs(xml)
  if (!childSitemaps.length) throw new Error(`${sitemapUrl} contains no URLs`)

  const isIndex = /<sitemapindex\b/i.test(xml)
  if (!isIndex) return childSitemaps

  const childResults = await mapWithConcurrency(childSitemaps, async (childUrl) => {
    const response = await request(childUrl)
    if (response.status !== 200) {
      throw new Error(`${childUrl} returned ${response.status}`)
    }
    return extractLocs(await response.text())
  })

  return [...new Set(childResults.flat())]
}

async function auditUrl(url) {
  const response = await request(url)
  const issues = []
  if (response.status !== 200) {
    issues.push(`returns ${response.status}${response.headers.get("location") ? ` → ${response.headers.get("location")}` : ""}`)
    return { url, issues }
  }

  const html = await response.text()
  const canonical = getCanonical(html)
  if (!canonical) {
    issues.push("missing canonical")
  } else if (normalizeUrl(new URL(canonical, url).toString()) !== normalizeUrl(url)) {
    issues.push(`canonical mismatch → ${canonical}`)
  }
  if (hasNoindex(html, [...response.headers.entries()].map(([key, value]) => `${key}: ${value}`).join("\n"))) {
    issues.push("contains noindex")
  }
  if (!hasTitle(html)) issues.push("missing title")
  if (!hasH1(html)) issues.push("missing H1")
  if (!/\S{200}/.test(html.replace(/<[^>]+>/g, " "))) issues.push("thin HTML response")

  return { url, issues }
}

const sitemapUrls = await getSitemapUrls()
const urls = sitemapUrls.slice(0, maxUrls)
const results = await mapWithConcurrency(urls, auditUrl)
const failures = results.filter((result) => result.issues.length > 0)

console.log(`[info] audited ${urls.length}/${sitemapUrls.length} canonical sitemap URLs as Googlebot`)
for (const result of failures) {
  console.error(`[fail] ${result.url} — ${result.issues.join("; ")}`)
}

if (failures.length) {
  console.error(`[fail] ${failures.length} URL quality issue(s) found`)
  process.exit(1)
}

console.log("[ok] every audited sitemap URL returned 200 with a self-canonical title and H1")
