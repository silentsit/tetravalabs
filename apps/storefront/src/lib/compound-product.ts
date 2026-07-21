import catalogHandles from "@/lib/catalog-handles.generated.json"
import type { StoreProduct, StoreCoaDocument } from "@/lib/medusa"
import { getProductByHandle, listCoasByVariant, listProducts } from "@/lib/medusa"
import { listProductReviews, type ProductReviewsResponse } from "@/lib/reviews"
import {
  getProductDisplayName,
  getProductDisplaySubtitle,
  getProductFullName,
  getProductImage,
  getProductPurity,
  getProductStrengthLabel
} from "@/lib/revamp/product-visual"
import { getProductGalleryImages } from "@/lib/product-image-map"
import { packTiersFromVariants, type PackTier } from "@/lib/pack-pricing"
import type { StoreVariant } from "@/lib/product-price"

/**
 * Trailing strength token on tiered catalog handles.
 * Keep this strict so compound codes like `bpc-157-5mg` resolve to parent `bpc-157`
 * (not `bpc` + `157-5mg`). Decimal masses use `0-1mg` → 0.1mg.
 */
const STRENGTH_SUFFIX_RE = /-((?:0-\d+mg)|\d+mg|\d+ml|\d+mcg|\d+-iu)$/i

export type CompoundMember = {
  handle: string
  strengthKey: string
  strengthLabel: string
}

export type CompoundFamily = {
  parentHandle: string
  members: CompoundMember[]
}

export type CompoundStrengthOption = {
  strengthKey: string
  strengthLabel: string
  productId: string
  handle: string
  title: string
  image: string
  galleryImages: string[]
  purity: string
  variants: StoreVariant[]
  packTiers: PackTier[]
  metadata: Record<string, unknown>
}

export type CompoundProductView = {
  parentHandle: string
  displayName: string
  displaySubtitle: string | null
  categoryLabel: string
  isCompound: boolean
  strengths: CompoundStrengthOption[]
  casNumber: string
  molecularFormula: string
  molecularWeight: string
  storage: string
  appearance: string
  sequence: string
  researchSummary: string
}

function formatStrengthLabel(strengthKey: string): string {
  if (/^\d+-iu$/i.test(strengthKey)) {
    return `${strengthKey.replace(/-iu$/i, "")} IU`
  }
  if (/^\d+-\d+mg$/i.test(strengthKey)) {
    return strengthKey.replace("-", ".")
  }
  return strengthKey
}

export function parseStrengthHandle(
  handle: string
): { parentHandle: string; strengthKey: string } | null {
  const match = handle.match(STRENGTH_SUFFIX_RE)
  if (!match) return null
  const strengthKey = match[1]
  const parentHandle = handle.slice(0, -(strengthKey.length + 1))
  if (!parentHandle) return null
  return { parentHandle, strengthKey }
}

function buildFamilyIndex(handles: string[]): Map<string, CompoundFamily> {
  const buckets = new Map<string, CompoundMember[]>()

  for (const handle of handles) {
    const parsed = parseStrengthHandle(handle)
    if (!parsed) continue
    const member: CompoundMember = {
      handle,
      strengthKey: parsed.strengthKey,
      strengthLabel: formatStrengthLabel(parsed.strengthKey)
    }
    const list = buckets.get(parsed.parentHandle) || []
    list.push(member)
    buckets.set(parsed.parentHandle, list)
  }

  const families = new Map<string, CompoundFamily>()
  for (const [parentHandle, members] of buckets) {
    if (members.length < 2) continue
    members.sort((a, b) => strengthSortKey(a.strengthKey) - strengthSortKey(b.strengthKey))
    families.set(parentHandle, { parentHandle, members })
  }
  return families
}

function strengthSortKey(strengthKey: string): number {
  const iu = strengthKey.match(/^(\d+)-iu$/i)
  if (iu) return Number(iu[1])
  const decimalMg = strengthKey.match(/^(\d+)-(\d+)mg$/i)
  if (decimalMg) return Number(`${decimalMg[1]}.${decimalMg[2]}`)
  const num = strengthKey.match(/^(\d+(?:\.\d+)?)/)
  return num ? Number(num[1]) : 0
}

const FAMILY_INDEX = buildFamilyIndex(catalogHandles as string[])

const MEMBER_TO_PARENT = new Map<string, string>()
for (const family of FAMILY_INDEX.values()) {
  for (const member of family.members) {
    MEMBER_TO_PARENT.set(member.handle, family.parentHandle)
  }
}

export function getCompoundFamily(parentHandle: string): CompoundFamily | null {
  return FAMILY_INDEX.get(parentHandle) || null
}

export function getCompoundParentHandle(handle: string): string | null {
  if (FAMILY_INDEX.has(handle)) return handle
  return MEMBER_TO_PARENT.get(handle) || null
}

export function isCompoundParentHandle(handle: string): boolean {
  return FAMILY_INDEX.has(handle)
}

export function isCompoundMemberHandle(handle: string): boolean {
  return MEMBER_TO_PARENT.has(handle)
}

/** Shop/card href: consolidated parents get ?strength= */
export function getProductHref(handle: string, packQty?: number): string {
  const parent = getCompoundParentHandle(handle)
  if (!parent) return `/product/${handle}`

  const family = getCompoundFamily(parent)
  const member = family?.members.find((m) => m.handle === handle)
  const strength = member?.strengthKey || parseStrengthHandle(handle)?.strengthKey
  if (!strength) return `/product/${parent}`

  const params = new URLSearchParams({ strength })
  if (packQty && packQty > 0) params.set("pack", String(packQty))
  return `/product/${parent}?${params.toString()}`
}

export function buildCompoundProductPath(
  parentHandle: string,
  strengthKey?: string,
  packQty?: number
): string {
  const params = new URLSearchParams()
  if (strengthKey) params.set("strength", strengthKey)
  if (packQty && packQty > 0) params.set("pack", String(packQty))
  const qs = params.toString()
  return qs ? `/product/${parentHandle}?${qs}` : `/product/${parentHandle}`
}

export function resolveCompoundRedirect(
  handle: string,
  searchParams?: { strength?: string; pack?: string }
): string | null {
  const parent = MEMBER_TO_PARENT.get(handle)
  if (!parent) return null

  const parsed = parseStrengthHandle(handle)
  const strength = searchParams?.strength || parsed?.strengthKey
  const pack = searchParams?.pack ? Number(searchParams.pack) : undefined
  return buildCompoundProductPath(parent, strength, Number.isFinite(pack) ? pack : undefined)
}

function stripStrengthFromTitle(title: string): string {
  const cleaned = title
    .replace(/\s+\d+(?:\.\d+)?\s*(mg|ml|mcg|iu)\b/gi, "")
    .replace(/\s*\(\d+(?:\.\d+)?\s*(mg|ml|mcg|iu)\)\s*$/i, "")
    .replace(/\s{2,}/g, " ")
    .trim()
  return cleaned || title
}

function researchSummaryFor(product: StoreProduct, displayName: string): string {
  const custom = String(product.metadata?.research_summary || "").trim()
  if (custom) return custom
  const category = String(product.metadata?.source_category || "research peptide")
  return `${displayName} is supplied for qualified laboratory research in the ${category} category. Each lot is documented with third-party analytical testing where COA documents are published.`
}

function toStrengthOption(product: StoreProduct): CompoundStrengthOption {
  const parsed = parseStrengthHandle(product.handle)
  const strengthKey =
    parsed?.strengthKey ||
    String(product.metadata?.strength || getProductStrengthLabel(product) || "standard")
  const strengthLabel = formatStrengthLabel(strengthKey)
  const variants = (product.variants || []) as StoreVariant[]

  return {
    strengthKey,
    strengthLabel,
    productId: product.id,
    handle: product.handle,
    title: getProductDisplayName(product),
    image: getProductImage(product),
    galleryImages: getProductGalleryImages(product.handle),
    purity: getProductPurity(product),
    variants,
    packTiers: packTiersFromVariants(variants),
    metadata: (product.metadata || {}) as Record<string, unknown>
  }
}

export function pickDefaultStrengthKey(
  strengths: CompoundStrengthOption[],
  requested?: string | null
): string {
  if (requested) {
    const exact = strengths.find(
      (s) =>
        s.strengthKey.toLowerCase() === requested.toLowerCase() ||
        s.strengthLabel.toLowerCase() === requested.toLowerCase()
    )
    if (exact) return exact.strengthKey
  }
  return strengths[0]?.strengthKey || ""
}

export function pickDefaultPackQty(
  strength: CompoundStrengthOption | undefined,
  requested?: string | null
): number | null {
  if (!strength?.packTiers.length) return null
  const qty = requested ? Number(requested) : NaN
  if (Number.isFinite(qty) && strength.packTiers.some((t) => t.qty === qty)) return qty
  return strength.packTiers[0]?.qty ?? null
}

export function isVariantInStock(variant: StoreVariant | undefined): boolean {
  if (!variant) return false
  if (variant.manage_inventory === false) return true
  if (variant.allow_backorder) return true
  if (variant.inventory_quantity == null) return true
  return variant.inventory_quantity > 0
}

export async function getCompoundProductView(
  handle: string
): Promise<CompoundProductView | null> {
  const family = getCompoundFamily(handle)
  if (family) {
    const products = await Promise.all(
      family.members.map((member) => getProductByHandle(member.handle))
    )
    const loaded = products.filter(Boolean) as StoreProduct[]
    if (!loaded.length) return null

    const strengths = family.members.flatMap((member) => {
      const product = loaded.find((item) => item.handle === member.handle)
      return product ? [toStrengthOption(product)] : []
    })

    if (!strengths.length) return null

    const primary =
      loaded.find((item) => item.handle === strengths[0]?.handle) || loaded[0]
    const displayName = stripStrengthFromTitle(getProductDisplayName(primary))

    return {
      parentHandle: family.parentHandle,
      displayName,
      displaySubtitle: getProductDisplaySubtitle(primary),
      categoryLabel: String(primary.metadata?.source_category || "Research Product"),
      isCompound: strengths.length > 1,
      strengths,
      casNumber: String(primary.metadata?.cas_number || "N/A"),
      molecularFormula: String(primary.metadata?.molecular_formula || "N/A"),
      molecularWeight: String(primary.metadata?.molecular_weight || "N/A"),
      storage: String(primary.metadata?.storage || "-20°C lyophilized"),
      appearance: String(primary.metadata?.appearance || "Lyophilized powder"),
      sequence: String(primary.metadata?.sequence || "N/A"),
      researchSummary: researchSummaryFor(primary, displayName)
    }
  }

  const product = await getProductByHandle(handle)
  if (!product) return null

  const strength = toStrengthOption(product)
  const displayName = getProductDisplayName(product)

  return {
    parentHandle: handle,
    displayName,
    displaySubtitle: getProductDisplaySubtitle(product),
    categoryLabel: String(product.metadata?.source_category || "Research Product"),
    isCompound: false,
    strengths: [strength],
    casNumber: String(product.metadata?.cas_number || "N/A"),
    molecularFormula: String(product.metadata?.molecular_formula || "N/A"),
    molecularWeight: String(product.metadata?.molecular_weight || "N/A"),
    storage: String(product.metadata?.storage || "-20°C lyophilized"),
    appearance: String(product.metadata?.appearance || "Lyophilized powder"),
    sequence: String(product.metadata?.sequence || "N/A"),
    researchSummary: researchSummaryFor(product, displayName)
  }
}

export async function loadStrengthSideData(strengths: CompoundStrengthOption[]) {
  const coasByStrength: Record<string, StoreCoaDocument[]> = {}
  const reviewsByStrength: Record<string, ProductReviewsResponse> = {}

  await Promise.all(
    strengths.map(async (strength) => {
      const primaryVariantId = strength.variants[0]?.id
      const [coas, reviews] = await Promise.all([
        primaryVariantId ? listCoasByVariant(primaryVariantId) : Promise.resolve([]),
        listProductReviews({
          productHandle: strength.handle,
          productId: strength.productId
        })
      ])
      coasByStrength[strength.strengthKey] = coas
      reviewsByStrength[strength.strengthKey] = reviews
    })
  )

  return { coasByStrength, reviewsByStrength }
}

export function compoundSeoName(view: CompoundProductView, strengthKey: string): string {
  const strength = view.strengths.find((s) => s.strengthKey === strengthKey)
  if (!strength) return view.displayName
  if (view.isCompound) {
    return getProductFullName(view.displayName, strength.strengthLabel)
  }
  return getProductFullName(
    strength.title,
    strength.strengthLabel !== "standard" ? strength.strengthLabel : null
  )
}

/** Prefer consolidated parent product when listing related cards. */
export function dedupeProductsByCompound(products: StoreProduct[]): StoreProduct[] {
  const seenParents = new Set<string>()
  const result: StoreProduct[] = []

  for (const product of products) {
    const parent = getCompoundParentHandle(product.handle)
    if (parent) {
      if (seenParents.has(parent)) continue
      seenParents.add(parent)
    }
    result.push(product)
  }
  return result
}

export function listCompoundParentHandles(): string[] {
  return [...FAMILY_INDEX.keys()].sort()
}

/** Warm path: resolve related from already-listed catalog products. */
export async function findRelatedCompoundProducts(
  view: CompoundProductView,
  limit = 4
): Promise<StoreProduct[]> {
  const all = await listProducts()
  const memberIds = new Set(view.strengths.map((s) => s.productId))
  const memberHandles = new Set(view.strengths.map((s) => s.handle))

  const sameCategory = all.filter((product) => {
    if (memberIds.has(product.id) || memberHandles.has(product.handle)) return false
    if (getCompoundParentHandle(product.handle) === view.parentHandle) return false
    return String(product.metadata?.source_category || "") === view.categoryLabel
  })

  return dedupeProductsByCompound(sameCategory).slice(0, limit)
}
