export function getMedusaStoreHeaders(extra: HeadersInit = {}) {
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
  return {
    ...extra,
    ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {})
  }
}

export function getMedusaStoreUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}
