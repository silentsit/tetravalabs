export function getTypesenseNodeConfig(env = process.env) {
  const host = (env.TYPESENSE_HOST || "localhost").trim()
  const protocol = (env.TYPESENSE_PROTOCOL || "http").trim()
  const defaultPort = protocol === "https" ? 443 : 8108
  const port = Number(env.TYPESENSE_PORT || defaultPort)
  return { host, port, protocol, defaultPort }
}

export function buildTypesenseBaseUrl(env = process.env) {
  const { host, port, protocol, defaultPort } = getTypesenseNodeConfig(env)
  if (port === defaultPort) {
    return `${protocol}://${host}`
  }
  return `${protocol}://${host}:${port}`
}

export function isTypesenseConfigured(env = process.env) {
  return Boolean(env.TYPESENSE_HOST?.trim() && env.TYPESENSE_API_KEY?.trim())
}

export function buildTypesenseSearchUrl(query, env = process.env) {
  const collection = env.TYPESENSE_COLLECTION || "products"
  const base = buildTypesenseBaseUrl(env)
  const url = new URL(`${base}/collections/${collection}/documents/search`)
  url.searchParams.set("q", query)
  url.searchParams.set("query_by", "title,handle,cas_number,molecular_formula,sequence")
  url.searchParams.set("per_page", "24")
  return url
}
