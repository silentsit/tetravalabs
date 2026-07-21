const DEFAULT_STORE_ADMIN_EMAILS = ["info@tetravalabs.com", "admin@tetravalabs.com"]

function parseEmailList(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function getStoreAdminEmails(): string[] {
  const configured = parseEmailList(process.env.NEXT_PUBLIC_STORE_ADMIN_EMAILS)
  return configured.length ? configured : DEFAULT_STORE_ADMIN_EMAILS
}

export function isStoreAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return getStoreAdminEmails().includes(email.trim().toLowerCase())
}
