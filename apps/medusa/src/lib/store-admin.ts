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

  return [
    ...parseEmailList(process.env.MEDUSA_ADMIN_EMAIL),
    ...parseEmailList(process.env.LEGACY_ADMIN_EMAIL)
  ]
}

export function isStoreAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.trim().toLowerCase()
  return getStoreAdminEmails().includes(normalized)
}
