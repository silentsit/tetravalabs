import {
  formatCoaCompound,
  formatCoaStrength,
  formatCoaSearchText
} from "@/lib/coa-display"
import {
  getCompoundFamily,
  getCompoundParentHandle,
  parseStrengthHandle,
  resolveCatalogHandle
} from "@/lib/compound-product"
import { resolveCatalogParentHandle } from "@/lib/catalog-filter"
import { catalogHandlesForCoa, type StoreCoaDocument } from "@/lib/medusa"
import { getProductImage } from "@/lib/product-image-map"
import {
  formatProductLabelWithStrengths,
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"

export type CoaLibraryProduct = {
  /** Catalog parent handle (or synthetic slug when unmapped). */
  parentHandle: string
  baseName: string
  /** Shop-style label, e.g. "BPC-157 (5mg / 10mg)". */
  displayName: string
  /** Strengths that have at least one COA, ordered. */
  strengthLabels: string[]
  documents: StoreCoaDocument[]
  documentsByStrength: Array<{ strengthLabel: string; documents: StoreCoaDocument[] }>
  previewDocument: StoreCoaDocument | null
  image: string
  documentCount: number
}

function slugifyCompound(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

function strengthSortValue(label: string): number {
  const iu = label.match(/^(\d+)\s*iu$/i)
  if (iu) return Number(iu[1])
  const num = label.match(/^(\d+(?:\.\d+)?)/)
  return num ? Number(num[1]) : Number.POSITIVE_INFINITY
}

/** Best-effort catalog parent for a COA document. */
export function resolveCoaParentHandle(doc: StoreCoaDocument): string {
  const handles = catalogHandlesForCoa(doc)
  for (const handle of handles) {
    const catalog = resolveCatalogHandle(handle)
    const parent =
      getCompoundParentHandle(catalog) ||
      resolveCatalogParentHandle(catalog) ||
      getCompoundParentHandle(handle) ||
      resolveCatalogParentHandle(handle)
    if (parent) return parent

    const parsed = parseStrengthHandle(catalog) || parseStrengthHandle(handle)
    if (parsed?.parentHandle) {
      return (
        getCompoundParentHandle(parsed.parentHandle) ||
        resolveCatalogParentHandle(parsed.parentHandle) ||
        parsed.parentHandle
      )
    }
  }

  if (handles[0]) return resolveCatalogHandle(handles[0])

  const compound = formatCoaCompound(doc)
  return slugifyCompound(compound) || "research-compound"
}

function normalizeStrengthLabel(raw: string, parentHandle: string, compoundName: string): string {
  let label = raw.trim()
  if (!label) return "Standard"

  const family = getCompoundFamily(parentHandle)
  const familyMatch = family?.members.find(
    (member) =>
      member.strengthLabel.toLowerCase() === label.toLowerCase() ||
      member.strengthKey.toLowerCase() === label.toLowerCase() ||
      label.toLowerCase().endsWith(member.strengthLabel.toLowerCase())
  )
  if (familyMatch) return familyMatch.strengthLabel

  // "BPC-157 5mg" / "BPC-157 (5mg)" → "5mg"
  const bareCompound = stripStrengthFromDisplayName(compoundName)
  if (bareCompound) {
    const stripped = label
      .replace(new RegExp(`^${bareCompound.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), "")
      .replace(/^\(|\)$/g, "")
      .trim()
    if (stripped) label = stripped
  }

  const unitMatch = label.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|ml|g|iu)\b/i)
  if (unitMatch) {
    const unit = unitMatch[2].toLowerCase() === "iu" ? " IU" : unitMatch[2].toLowerCase()
    return `${unitMatch[1]}${unit}`
  }

  const countMatch = label.match(/(\d+\s*count(?:[^,]*)?)/i)
  if (countMatch) return countMatch[1].replace(/\s+/g, " ").trim()

  return label
}

function strengthLabelFromHandle(handle: string, parentHandle: string): string | null {
  const catalog = resolveCatalogHandle(handle)
  const parsed = parseStrengthHandle(catalog) || parseStrengthHandle(handle)
  if (!parsed) return null

  const family = getCompoundFamily(parentHandle)
  const member = family?.members.find(
    (item) => item.strengthKey === parsed.strengthKey || item.handle === catalog
  )
  if (member) return member.strengthLabel

  return parsed.strengthKey
    .replace(/-iu$/i, " IU")
    .replace(/^(\d+)-(\d+)mg$/i, "$1.$2mg")
}

function resolveDocStrengthLabel(doc: StoreCoaDocument, parentHandle: string): string {
  const compoundName = formatCoaCompound(doc)

  for (const handle of catalogHandlesForCoa(doc)) {
    const fromHandle = strengthLabelFromHandle(handle, parentHandle)
    if (fromHandle) return normalizeStrengthLabel(fromHandle, parentHandle, compoundName)
  }

  const fromMeta = formatCoaStrength(doc)
  if (fromMeta) return normalizeStrengthLabel(fromMeta, parentHandle, compoundName)

  return "Standard"
}

function orderStrengthLabels(parentHandle: string, labels: string[]): string[] {
  const family = getCompoundFamily(parentHandle)
  if (family?.members.length) {
    const familyOrder = family.members.map((member) => member.strengthLabel)
    const ordered = familyOrder.filter((label) => labels.includes(label))
    const extras = labels
      .filter((label) => !ordered.includes(label))
      .sort((a, b) => strengthSortValue(a) - strengthSortValue(b) || a.localeCompare(b))
    return [...ordered, ...extras]
  }
  return [...labels].sort((a, b) => strengthSortValue(a) - strengthSortValue(b) || a.localeCompare(b))
}

type CoaBucket = {
  parentHandle: string
  compoundName: string
  byStrength: Map<string, StoreCoaDocument[]>
  documents: StoreCoaDocument[]
}

function preferBucketHandle(a: string, b: string): boolean {
  const aFamily = Boolean(getCompoundFamily(a))
  const bFamily = Boolean(getCompoundFamily(b))
  if (aFamily !== bFamily) return aFamily
  const aCatalog = Boolean(resolveCatalogParentHandle(a))
  const bCatalog = Boolean(resolveCatalogParentHandle(b))
  if (aCatalog !== bCatalog) return aCatalog
  return false
}

function mergeBucketDocs(primary: CoaBucket, secondary: CoaBucket) {
  const seen = new Set(primary.documents.map((doc) => doc.id))
  for (const doc of secondary.documents) {
    if (seen.has(doc.id)) continue
    seen.add(doc.id)
    primary.documents.push(doc)
    const strengthLabel = resolveDocStrengthLabel(doc, primary.parentHandle)
    const list = primary.byStrength.get(strengthLabel) || []
    list.push(doc)
    primary.byStrength.set(strengthLabel, list)
  }
  if (
    primary.compoundName === "Research compound" &&
    secondary.compoundName !== "Research compound"
  ) {
    primary.compoundName = secondary.compoundName
  }
}

/**
 * Collapse flat COA documents into shop-style parent products.
 * Only products with ≥1 document appear.
 */
export function groupCoasByProduct(documents: StoreCoaDocument[]): CoaLibraryProduct[] {
  const buckets = new Map<string, CoaBucket>()

  for (const doc of documents) {
    const parentHandle = resolveCoaParentHandle(doc)
    const strengthLabel = resolveDocStrengthLabel(doc, parentHandle)
    const compoundName = normalizeTb500DisplayText(formatCoaCompound(doc))
    let bucket = buckets.get(parentHandle)
    if (!bucket) {
      bucket = {
        parentHandle,
        compoundName,
        byStrength: new Map(),
        documents: []
      }
      buckets.set(parentHandle, bucket)
    }
    if (bucket.compoundName === "Research compound" && compoundName !== "Research compound") {
      bucket.compoundName = compoundName
    }
    bucket.documents.push(doc)
    const list = bucket.byStrength.get(strengthLabel) || []
    list.push(doc)
    bucket.byStrength.set(strengthLabel, list)
  }

  // Merge buckets that share a display base name but resolved to different keys
  // (e.g. catalog handle vs metadata-only slug).
  const mergedByName = new Map<string, CoaBucket>()
  for (const bucket of buckets.values()) {
    const nameKey = stripStrengthFromDisplayName(bucket.compoundName).toLowerCase()
    const existing = mergedByName.get(nameKey)
    if (!existing) {
      mergedByName.set(nameKey, bucket)
      continue
    }

    if (preferBucketHandle(bucket.parentHandle, existing.parentHandle)) {
      mergeBucketDocs(bucket, existing)
      mergedByName.set(nameKey, bucket)
    } else {
      mergeBucketDocs(existing, bucket)
    }
  }

  const products: CoaLibraryProduct[] = []

  for (const bucket of mergedByName.values()) {
    const strengthLabels = orderStrengthLabels(bucket.parentHandle, [...bucket.byStrength.keys()])
    const baseName = stripStrengthFromDisplayName(bucket.compoundName)
    const displayName = formatProductLabelWithStrengths(baseName, strengthLabels)

    const documentsByStrength = strengthLabels.map((strengthLabel) => ({
      strengthLabel,
      documents: bucket.byStrength.get(strengthLabel) || []
    }))

    const previewDocument =
      documentsByStrength.flatMap((group) => group.documents).find((doc) => doc.preview_url) ||
      bucket.documents[0] ||
      null

    products.push({
      parentHandle: bucket.parentHandle,
      baseName,
      displayName,
      strengthLabels,
      documents: bucket.documents,
      documentsByStrength,
      previewDocument,
      image: getProductImage(bucket.parentHandle),
      documentCount: bucket.documents.length
    })
  }

  return products.sort((a, b) => a.baseName.localeCompare(b.baseName))
}

export function findCoaLibraryProduct(
  products: CoaLibraryProduct[],
  handleOrSegment: string
): CoaLibraryProduct | null {
  const resolved = resolveCatalogHandle(handleOrSegment)
  const parent =
    getCompoundParentHandle(resolved) ||
    resolveCatalogParentHandle(resolved) ||
    getCompoundParentHandle(handleOrSegment) ||
    resolveCatalogParentHandle(handleOrSegment) ||
    resolved

  return (
    products.find((product) => product.parentHandle === parent) ||
    products.find((product) => product.parentHandle === resolved) ||
    products.find((product) => product.parentHandle === handleOrSegment) ||
    null
  )
}

export function formatCoaLibrarySearchText(product: CoaLibraryProduct): string {
  return [
    product.displayName,
    product.baseName,
    product.parentHandle,
    ...product.strengthLabels,
    ...product.documents.map((doc) => formatCoaSearchText(doc))
  ].join(" ")
}

export function coaLibraryProductPath(parentHandle: string): string {
  return `/coa-library/${encodeURIComponent(parentHandle)}`
}
