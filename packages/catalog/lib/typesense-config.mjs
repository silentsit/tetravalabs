function normalizeTypesenseHost(rawHost) {
  let host = (rawHost || "").trim()
  if (!host) {
    return { host: "localhost", protocolOverride: null, portOverride: null }
  }

  if (host.includes("://")) {
    try {
      const parsed = new URL(host)
      return {
        host: parsed.hostname,
        protocolOverride: parsed.protocol.replace(":", "") || null,
        portOverride: parsed.port ? Number(parsed.port) : null
      }
    } catch {
      // Fall through and strip protocol manually.
    }
  }

  host = host.replace(/^https?:\/\//i, "").replace(/\/+$/, "")
  const slashIndex = host.indexOf("/")
  if (slashIndex !== -1) {
    host = host.slice(0, slashIndex)
  }

  const colonIndex = host.lastIndexOf(":")
  if (colonIndex > 0 && /^\d+$/.test(host.slice(colonIndex + 1))) {
    const portOverride = Number(host.slice(colonIndex + 1))
    host = host.slice(0, colonIndex)
    return { host, protocolOverride: null, portOverride }
  }

  return { host, protocolOverride: null, portOverride: null }
}

export function getTypesenseNodeConfig(env = process.env) {
  const normalized = normalizeTypesenseHost(env.TYPESENSE_HOST)
  const protocol = (normalized.protocolOverride || env.TYPESENSE_PROTOCOL || "http").trim()
  const defaultPort = protocol === "https" ? 443 : 8108
  const port = Number(
    normalized.portOverride ?? env.TYPESENSE_PORT ?? defaultPort
  )
  return { host: normalized.host, port, protocol, defaultPort }
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
