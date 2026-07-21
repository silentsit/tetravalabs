const DEFAULT_STORE_ADMIN_EMAILS = ["info@tetravalabs.com", "admin@tetravalabs.com"]

function parseEmailList(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function getStoreAdminEmails(): string[] {
  const configured = parseEmailList(process.env.STORE_ADMIN_EMAILS)
  if (configured.length) return configured

  const fromEnv = [
    ...parseEmailList(process.env.MEDUSA_ADMIN_EMAIL),
    ...parseEmailList(process.env.LEGACY_ADMIN_EMAIL)
  ]
  return fromEnv.length ? fromEnv : DEFAULT_STORE_ADMIN_EMAILS
}

export function isStoreAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return getStoreAdminEmails().includes(normalized)
}
