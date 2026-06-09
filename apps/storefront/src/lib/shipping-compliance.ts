export function getRestrictedCountries() {
  return (process.env.RESTRICTED_COUNTRIES || "")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean)
}

export function isRestrictedCountry(countryCode: string) {
  const normalized = countryCode.trim().toUpperCase()
  if (!normalized) return false
  const restricted = new Set(getRestrictedCountries())
  return restricted.has(normalized)
}
