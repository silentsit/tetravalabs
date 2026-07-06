/** @param {string} url */
function isLocalDatabaseUrl(url) {
  if (!url) return false
  try {
    const parsed = new URL(url.replace(/^postgres(ql)?:/i, "http:"))
    const host = parsed.hostname.toLowerCase()
    return host === "localhost" || host === "127.0.0.1"
  } catch {
    return /(^postgres(?:ql)?:\/\/[^@]*@)(localhost|127\.0\.0\.1)(:\d+)?\//i.test(url)
  }
}

/** @param {string} raw */
function normalizeDatabaseUrl(raw) {
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

/** @param {string} url */
function isRemoteDatabaseUrl(url) {
  return Boolean(url && !isLocalDatabaseUrl(url))
}

/** @param {string} url */
function pgSslOptions(url) {
  return isRemoteDatabaseUrl(url) ? { rejectUnauthorized: false } : undefined
}

function applyDatabaseUrlEnv() {
  const normalized = normalizeDatabaseUrl(process.env.DATABASE_URL || "")
  if (normalized) process.env.DATABASE_URL = normalized
  return normalized
}

module.exports = {
  isLocalDatabaseUrl,
  normalizeDatabaseUrl,
  isRemoteDatabaseUrl,
  pgSslOptions,
  applyDatabaseUrlEnv
}
