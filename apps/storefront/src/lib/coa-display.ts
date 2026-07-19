import type { StoreCoaDocument } from "@/lib/medusa"

function strengthFromHandle(handle: string): string | null {
  const slugMatch = handle.match(/(\d+(?:\.\d+)?(?:mg|mcg|ml|g|iu))(?:$|-)/i)
  if (slugMatch) return slugMatch[1]

  const countMatch = handle.match(/(\d+\s*count[^/]*)/i)
  if (countMatch) return countMatch[1].replace(/-/g, " ")

  return null
}

/** Resolve variant strength/size for display (10mg, 50mg, 100 count, etc.). */
export function formatCoaStrength(doc: StoreCoaDocument): string | null {
  const meta = doc.metadata || {}

  for (const key of ["variant", "variant_title", "strength", "size"] as const) {
    const value = meta[key]
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }

  if (typeof meta.variant_handle === "string") {
    const fromHandle = strengthFromHandle(meta.variant_handle)
    if (fromHandle) return fromHandle
  }

  if (typeof meta.catalog_slug === "string") {
    const fromSlug = strengthFromHandle(meta.catalog_slug)
    if (fromSlug) return fromSlug
  }

  const idMatch = doc.id.match(/_(\d+(?:\.\d+)?(?:mg|mcg|ml|g|iu))_/i)
  if (idMatch) return idMatch[1]

  const idCountMatch = doc.id.match(/_(\d+_count(?:_\d+mcg)?)_/i)
  if (idCountMatch) return idCountMatch[1].replace(/_/g, " ")

  return null
}

export function formatCoaCompound(doc: StoreCoaDocument): string {
  return doc.metadata?.compound ? String(doc.metadata.compound) : "Research compound"
}

export function formatCoaTitle(doc: StoreCoaDocument): string {
  const compound = formatCoaCompound(doc)
  const strength = formatCoaStrength(doc)
  const strengthLabel = strength ? ` ${strength}` : ""
  return `${compound}${strengthLabel} — Batch ${doc.batch_number} (${doc.document_type.toUpperCase()})`
}

export function formatCoaSearchText(doc: StoreCoaDocument): string {
  return [
    formatCoaCompound(doc),
    formatCoaStrength(doc),
    doc.batch_number,
    doc.document_type,
    doc.variant_id,
    doc.id
  ]
    .filter(Boolean)
    .join(" ")
}

export function isCoaPdfPreviewUrl(url: string) {
  return (
    /\.pdf(\?|$)/i.test(url) ||
    url.includes("/file") ||
    url.startsWith("/api/coa-file")
  )
}
