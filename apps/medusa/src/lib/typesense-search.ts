const collection = process.env.TYPESENSE_COLLECTION || "products"

function normalizeTypesenseHost(rawHost?: string) {
  let host = (rawHost || "").trim()
  if (!host) {
    return { host: "localhost", protocolOverride: null as string | null, portOverride: null as number | null }
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
      // Fall through.
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

export function getTypesenseNodeConfig(env: NodeJS.ProcessEnv = process.env) {
  const normalized = normalizeTypesenseHost(env.TYPESENSE_HOST)
  const protocol = (normalized.protocolOverride || env.TYPESENSE_PROTOCOL || "http").trim()
  const defaultPort = protocol === "https" ? 443 : 8108
  const port = Number(normalized.portOverride ?? env.TYPESENSE_PORT ?? defaultPort)
  return { host: normalized.host, port, protocol, defaultPort }
}

export function buildTypesenseBaseUrl(env: NodeJS.ProcessEnv = process.env) {
  const { host, port, protocol, defaultPort } = getTypesenseNodeConfig(env)
  if (port === defaultPort) {
    return `${protocol}://${host}`
  }
  return `${protocol}://${host}:${port}`
}

export function isTypesenseConfigured(env: NodeJS.ProcessEnv = process.env) {
  return Boolean(env.TYPESENSE_HOST?.trim() && env.TYPESENSE_API_KEY?.trim())
}

export type TypesenseSearchFilters = {
  category?: string
  priceMin?: number
  priceMax?: number
}

function buildFilterBy(filters?: TypesenseSearchFilters) {
  const parts: string[] = []
  if (filters?.category?.trim()) {
    parts.push(`category:=\`${filters.category.trim()}\``)
  }
  if (filters?.priceMin != null && Number.isFinite(filters.priceMin)) {
    parts.push(`price_min:>=${Math.round(filters.priceMin)}`)
  }
  if (filters?.priceMax != null && Number.isFinite(filters.priceMax)) {
    parts.push(`price_max:<=${Math.round(filters.priceMax)}`)
  }
  return parts.join(" && ")
}

export function buildTypesenseSearchUrl(
  query: string,
  filters?: TypesenseSearchFilters,
  env: NodeJS.ProcessEnv = process.env
) {
  const base = buildTypesenseBaseUrl(env)
  const url = new URL(`${base}/collections/${collection}/documents/search`)
  url.searchParams.set("q", query.trim() || "*")
  url.searchParams.set("query_by", "title,handle,cas_number,molecular_formula,sequence")
  url.searchParams.set("per_page", "24")
  const filterBy = buildFilterBy(filters)
  if (filterBy) {
    url.searchParams.set("filter_by", filterBy)
  }
  return url
}

export type TypesenseProductHit = {
  id: string
  title: string
  handle: string
  category: string
  price_min: number
  price_max: number
  visual_type: string
}

export async function searchTypesenseProducts(
  query: string,
  filters?: TypesenseSearchFilters
): Promise<TypesenseProductHit[] | null> {
  const apiKey = process.env.TYPESENSE_API_KEY
  if (!isTypesenseConfigured() || !apiKey) return null

  const url = buildTypesenseSearchUrl(query, filters)

  try {
    const response = await fetch(url.toString(), {
      headers: { "X-TYPESENSE-API-KEY": apiKey },
      cache: "no-store"
    })
    if (!response.ok) return null
    const data = (await response.json()) as { hits?: Array<{ document: TypesenseProductHit }> }
    return (data.hits || []).map((hit) => hit.document)
  } catch {
    return null
  }
}
