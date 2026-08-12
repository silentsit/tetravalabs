/**
 * Accept-header content negotiation + path eligibility for AI-agent markdown mirrors.
 * Kept dependency-free (no `server-only` imports) so it can run in edge middleware.
 */

const STATIC_MARKDOWN_PATHS = new Set([
  "/",
  "/shop",
  "/categories",
  "/blog",
  "/coa-library",
  "/about",
  "/contact",
  "/faq",
  "/shipping",
  "/payment",
  "/terms",
  "/privacy",
  "/refund",
  "/ruo"
])

const EXCLUDED_PREFIXES = [
  "/checkout",
  "/account",
  "/orders",
  "/cart",
  "/login",
  "/register",
  "/search",
  "/api/",
  "/reorder",
  "/md-mirror",
  "/.well-known",
  "/coa-library/",
  "/reviews",
  "/shipping-restricted"
]

/** Exact paths that look like single segments but are not product handles. */
const EXCLUDED_PATHS = new Set([
  "/sitemap.md",
  "/auth.md",
  "/openapi.json",
  "/robots.txt",
  "/favicon.ico"
])

const CATEGORY_PATH_RE = /^\/category\/[^/]+$/
const BLOG_POST_PATH_RE = /^\/blog\/[^/]+$/
const SINGLE_SEGMENT_RE = /^\/[^/]+$/

/** Whether a pathname is eligible for markdown negotiation (mirrors robots.txt disallow scope). */
export function isMarkdownEligiblePath(pathname: string): boolean {
  if (EXCLUDED_PATHS.has(pathname)) return false
  if (EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false
  if (STATIC_MARKDOWN_PATHS.has(pathname)) return true
  if (CATEGORY_PATH_RE.test(pathname)) return true
  if (BLOG_POST_PATH_RE.test(pathname)) return true
  // Product handles are extension-free single segments (skip /auth.md, /openapi.json, etc.).
  if (SINGLE_SEGMENT_RE.test(pathname) && !pathname.includes(".")) return true
  return false
}

type MediaPreference = { type: string; q: number; order: number }

function parseAccept(header: string): MediaPreference[] {
  return header
    .split(",")
    .map((part, order) => {
      const segments = part.trim().split(";")
      const type = (segments.shift() || "").trim().toLowerCase()
      let q = 1
      for (const segment of segments) {
        const [key, value] = segment.split("=").map((piece) => piece.trim())
        if (key === "q" && value) {
          const parsed = Number(value)
          if (Number.isFinite(parsed)) q = parsed
        }
      }
      return { type, q, order }
    })
    .filter((entry) => entry.type.length > 0)
}

/**
 * True when the client's `Accept` header prefers `text/markdown` over `text/html`.
 * Handles both q-value negotiation (OpenCode, Cursor) and order-based preference
 * (Claude Code sends `text/markdown` first with no q values).
 */
export function acceptPrefersMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false
  const preferences = parseAccept(acceptHeader)

  const markdown = preferences.find((entry) => entry.type === "text/markdown")
  if (!markdown || markdown.q <= 0) return false

  const html = preferences.find(
    (entry) => entry.type === "text/html" || entry.type === "application/xhtml+xml"
  )
  if (!html) return true

  if (markdown.q !== html.q) return markdown.q > html.q
  return markdown.order < html.order
}
