/** Shared PostgreSQL URL normalization for Medusa config, scripts, and pg pools. */

export function isLocalDatabaseUrl(url: string) {
  if (!url) return false
  try {
    const parsed = new URL(url.replace(/^postgres(ql)?:/i, "http:"))
    const host = parsed.hostname.toLowerCase()
    return host === "localhost" || host === "127.0.0.1"
  } catch {
    return /(^postgres(?:ql)?:\/\/[^@]*@)(localhost|127\.0\.0\.1)(:\d+)?\//i.test(url)
  }
}

export function normalizeDatabaseUrl(raw: string) {
  if (!raw?.trim()) return raw?.trim() ?? ""

  let url = raw.trim()

  url = url
    .replace(/([?&])channel_binding=require&/i, "$1")
    .replace(/([?&])channel_binding=require(?=&|$)/i, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "")

  if (!isLocalDatabaseUrl(url)) {
    if (!/[?&]sslmode=/i.test(url)) {
      url += url.includes("?") ? "&sslmode=require" : "?sslmode=require"
    } else {
      url = url.replace(
        /([?&])sslmode=(?:prefer|disable|allow)(?=&|$)/gi,
        "$1sslmode=require"
      )
    }
  }

  return url
}

export function applyDatabaseUrlEnv() {
  const normalized = normalizeDatabaseUrl(process.env.DATABASE_URL || "")
  if (normalized) process.env.DATABASE_URL = normalized
  return normalized
}

export function isRemoteDatabaseUrl(url: string) {
  return Boolean(url && !isLocalDatabaseUrl(url))
}

export function pgSslOptions(url: string) {
  return isRemoteDatabaseUrl(url) ? { rejectUnauthorized: false } : undefined
}
