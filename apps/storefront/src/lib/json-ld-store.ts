export type JsonLdGraph = Record<string, unknown>

type DynamicResolver = {
  pattern: RegExp
  resolve: (match: RegExpMatchArray) => Promise<JsonLdGraph[]>
}

const pathRegistrations = new Map<string, JsonLdGraph[]>()
const dynamicResolvers: DynamicResolver[] = []

export function normalizePath(path: string) {
  if (!path || path === "/") return "/"
  return path.endsWith("/") ? path.slice(0, -1) : path
}

export function registerPageJsonLd(path: string, graphs: JsonLdGraph[]) {
  if (!graphs.length) return
  pathRegistrations.set(normalizePath(path), graphs)
}

export function registerDynamicJsonLd(
  pattern: RegExp,
  resolve: (match: RegExpMatchArray) => Promise<JsonLdGraph[]>
) {
  dynamicResolvers.push({ pattern, resolve })
}

export async function resolvePageJsonLd(pathname: string): Promise<JsonLdGraph[]> {
  const path = normalizePath(pathname)

  for (const { pattern, resolve } of dynamicResolvers) {
    const match = path.match(pattern)
    if (match) return resolve(match)
  }

  return pathRegistrations.get(path) || []
}
