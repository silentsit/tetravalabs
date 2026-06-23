function parseEmailList(raw: string | undefined): string[] {
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function isStoreAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const configured = parseEmailList(process.env.NEXT_PUBLIC_STORE_ADMIN_EMAILS)
  return configured.includes(email.trim().toLowerCase())
}
