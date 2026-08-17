import compoundFamilies from "@/lib/compound-families.generated.json"
import compoundLegacyRedirects from "@/lib/compound-legacy-redirects.generated.json"
import productEnrichment from "@/lib/product-enrichment.generated.json"
import {
  getProductByHandle,
  listCoasForStrengths,
  listProducts,
  type StoreCoaDocument,
  type StoreProduct
} from "@/lib/medusa"
import { emptyProductReviews, listProductReviews, type ProductReviewsResponse } from "@/lib/reviews"
import { storefrontCategoryLabelForProduct } from "@/lib/categories"
import {
  formatProductLabelWithStrengths,
  getProductDisplayName,
  getProductDisplaySubtitle,
  getProductFullName,
  getProductImage,
  getProductPurity,
  getProductStrengthLabel,
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"
import { getProductGalleryImages } from "@/lib/product-image-map"
import {
  groupVariantsByStrength,
  packTiersFromVariants,
  type PackTier
} from "@/lib/pack-pricing"
import type { StoreVariant } from "@/lib/product-price"
import {
  catalogHandleFromPublicSegment,
  PRODUCT_HANDLE_TO_URL
} from "@/lib/product-url-aliases"

const STRENGTH_SUFFIX_RE = /-((?:0-\d+mg)|\d+mg|\d+ml|\d+mcg|\d+-iu)$/i

type GeneratedFamilyMember = {
  legacy_slug: string
  strength_key: string
  strength_label: string
}

type GeneratedFamily = {
  title: string
  members: GeneratedFamilyMember[]
}

type LegacyRedirect = {
  parent: string
  strength: string
}

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
  imageHandle: string
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

function strengthSortKey(strengthKey: string): number {
  const iu = strengthKey.match(/^(\d+)-iu$/i)
  if (iu) return Number(iu[1])
  const decimalMg = strengthKey.match(/^(\d+)-(\d+)mg$/i)
  if (decimalMg) return Number(`${decimalMg[1]}.${decimalMg[2]}`)
  const num = strengthKey.match(/^(\d+(?:\.\d+)?)/)
  return num ? Number(num[1]) : 0
}

function buildFamilyIndex(): Map<string, CompoundFamily> {
  const families = new Map<string, CompoundFamily>()
  const source = compoundFamilies as Record<string, GeneratedFamily>

  for (const [parentHandle, family] of Object.entries(source)) {
    const members = family.members
      .map((member) => ({
        handle: member.legacy_slug,
        strengthKey: member.strength_key,
        strengthLabel: member.strength_label || formatStrengthLabel(member.strength_key)
      }))
      .sort((a, b) => strengthSortKey(a.strengthKey) - strengthSortKey(b.strengthKey))

    if (members.length >= 2) {
      families.set(parentHandle, { parentHandle, members })
    }
  }

  return families
}

const FAMILY_INDEX = buildFamilyIndex()

const MEMBER_TO_PARENT = new Map<string, string>()
for (const [legacyHandle, redirect] of Object.entries(
  compoundLegacyRedirects as Record<string, LegacyRedirect>
)) {
  MEMBER_TO_PARENT.set(legacyHandle, redirect.parent)
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

/** Map a URL segment or catalog handle to the Medusa/catalog product handle. */
export function resolveCatalogHandle(urlOrHandle: string): string {
  return catalogHandleFromPublicSegment(urlOrHandle) || urlOrHandle
}

/** Map a Medusa handle to the public URL segment (pretty slug when defined). */
export function canonicalProductSegment(handle: string): string {
  const parent = getCompoundParentHandle(handle)
  const catalog = parent || handle
  return PRODUCT_HANDLE_TO_URL[catalog] || catalog
}

/** Long catalog handles → pretty URL (e.g. …-100-count-500mcg → /bpc-157-capsules). */
export function resolvePrettyUrlRedirect(handle: string): string | null {
  const pretty = PRODUCT_HANDLE_TO_URL[handle]
  if (!pretty || pretty === handle) return null
  return `/${pretty}`
}

/** Canonical product path: /{handle} with no strength/pack query params. */
export function productPath(handle: string): string {
  return `/${canonicalProductSegment(handle)}`
}

export function getProductHref(handle: string, _packQty?: number): string {
  const parent = getCompoundParentHandle(handle)
  return productPath(parent || handle)
}

/**
 * Shelf/card label in Core Peptides style:
 * - single: "Adamax (10mg)"
 * - multi: "BPC-157 (5mg / 10mg)"
 */
export function getShelfProductLabel(product: StoreProduct): string {
  const parent = getCompoundParentHandle(product.handle) || product.handle
  const family = getCompoundFamily(parent)
  const baseName = stripStrengthFromDisplayName(getProductDisplayName(product))

  if (family?.members.length) {
    return formatProductLabelWithStrengths(
      baseName,
      family.members.map((member) => member.strengthLabel)
    )
  }

  const single = getProductStrengthLabel(product)
  if (single) return formatProductLabelWithStrengths(baseName, [single])

  return formatProductLabelWithStrengths(baseName, [])
}

/** Search/index fallback when only handle + title are available. */
export function getShelfLabelForHandle(handle: string, fallbackTitle: string): string {
  const parent = getCompoundParentHandle(handle) || handle
  const family = getCompoundFamily(parent)
  const baseName = stripStrengthFromDisplayName(normalizeTb500DisplayText(fallbackTitle))

  if (family?.members.length) {
    return formatProductLabelWithStrengths(
      baseName,
      family.members.map((member) => member.strengthLabel)
    )
  }

  const parsed = parseStrengthHandle(handle)
  if (parsed) {
    return formatProductLabelWithStrengths(baseName, [formatStrengthLabel(parsed.strengthKey)])
  }

  const handleStrength = handle.match(
    /(\d+-\d+mg|\d+(?:\.\d+)?(?:mg|ml|mcg)|\d+-iu|\d+iu)$/i
  )
  if (handleStrength) {
    const raw = handleStrength[1].toLowerCase()
    const label = /^\d+-\d+mg$/i.test(raw)
      ? raw.replace("-", ".")
      : formatStrengthLabel(raw)
    return formatProductLabelWithStrengths(baseName, [label])
  }

  return baseName
}

export function buildCompoundProductPath(
  parentHandle: string,
  _strengthKey?: string,
  _packQty?: number
): string {
  return productPath(parentHandle)
}

export function resolveCompoundRedirect(
  handle: string,
  _searchParams?: { strength?: string; pack?: string }
): string | null {
  const redirect = (compoundLegacyRedirects as Record<string, LegacyRedirect>)[handle]
  if (!redirect) return null
  return productPath(redirect.parent)
}

function stripStrengthFromTitle(title: string): string {
  return stripStrengthFromDisplayName(title)
}

function isMergedMedusaProduct(product: StoreProduct): boolean {
  if (product.metadata?.compound_merged) return true
  const variants = (product.variants || []) as StoreVariant[]
  return groupVariantsByStrength(variants).size > 1
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
    imageHandle: product.handle,
    title: getProductDisplayName(product),
    image: getProductImage(product),
    galleryImages: getProductGalleryImages(product.handle),
    purity: getProductPurity(product),
    variants,
    packTiers: packTiersFromVariants(variants),
    metadata: (product.metadata || {}) as Record<string, unknown>
  }
}

function toStrengthOptionFromMerged(
  product: StoreProduct,
  member: CompoundMember,
  variants: StoreVariant[]
): CompoundStrengthOption {
  const legacyHandle =
    String(
      variants.find((variant) => variant.metadata?.legacy_product_handle)?.metadata
        ?.legacy_product_handle || member.handle
    ) || member.handle

  return {
    strengthKey: member.strengthKey,
    strengthLabel: member.strengthLabel,
    productId: product.id,
    handle: product.handle,
    imageHandle: legacyHandle,
    title: getProductDisplayName(product),
    image: getProductImage(product),
    galleryImages: getProductGalleryImages(legacyHandle),
    purity: getProductPurity(product),
    variants,
    packTiers: packTiersFromVariants(variants),
    metadata: (product.metadata || {}) as Record<string, unknown>
  }
}

type EnrichmentRow = {
  cas_number?: string | null
  molecular_formula?: string | null
  molecular_weight?: string | null
  sequence?: string | null
  storage?: string | null
  appearance?: string | null
  category?: string | null
}

const ENRICHMENT_BY_HANDLE = productEnrichment as Record<string, EnrichmentRow>

function enrichmentFor(handle: string): EnrichmentRow {
  return ENRICHMENT_BY_HANDLE[handle] || {}
}

function pickMeta(
  metadata: Record<string, unknown> | null | undefined,
  enrichment: EnrichmentRow,
  key: keyof EnrichmentRow,
  fallback: string
): string {
  const fromMeta = metadata?.[key]
  if (typeof fromMeta === "string" && fromMeta.trim() && fromMeta !== "N/A") {
    return fromMeta
  }
  const fromEnrichment = enrichment[key]
  if (typeof fromEnrichment === "string" && fromEnrichment.trim()) {
    return fromEnrichment
  }
  return fallback
}

function buildCompoundView(
  parentHandle: string,
  primary: StoreProduct,
  strengths: CompoundStrengthOption[]
): CompoundProductView {
  const displayName = stripStrengthFromTitle(getProductDisplayName(primary))
  const enrichment = enrichmentFor(parentHandle)
  const meta = (primary.metadata || {}) as Record<string, unknown>

  return {
    parentHandle,
    displayName,
    displaySubtitle: getProductDisplaySubtitle(primary),
    categoryLabel:
      enrichment.category ||
      storefrontCategoryLabelForProduct(
        parentHandle,
        displayName,
        String(primary.metadata?.source_category || "")
      ),
    isCompound: strengths.length > 1,
    strengths,
    casNumber: pickMeta(meta, enrichment, "cas_number", "N/A"),
    molecularFormula: pickMeta(meta, enrichment, "molecular_formula", "N/A"),
    molecularWeight: pickMeta(meta, enrichment, "molecular_weight", "N/A"),
    storage: pickMeta(meta, enrichment, "storage", "-20°C lyophilized"),
    appearance: pickMeta(meta, enrichment, "appearance", "Lyophilized powder"),
    sequence: pickMeta(meta, enrichment, "sequence", "N/A"),
    researchSummary: ""
  }
}

function viewFromMergedProduct(
  product: StoreProduct,
  family: CompoundFamily
): CompoundProductView | null {
  const byStrength = groupVariantsByStrength((product.variants || []) as StoreVariant[])
  const strengths = family.members.flatMap((member) => {
    const variants = byStrength.get(member.strengthKey) || []
    return variants.length ? [toStrengthOptionFromMerged(product, member, variants)] : []
  })

  if (!strengths.length) return null
  return buildCompoundView(family.parentHandle, product, strengths)
}

async function loadLegacyCompoundView(
  family: CompoundFamily
): Promise<CompoundProductView | null> {
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
  return buildCompoundView(family.parentHandle, primary, strengths)
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
    const parentProduct = await getProductByHandle(family.parentHandle)
    if (parentProduct && isMergedMedusaProduct(parentProduct)) {
      return viewFromMergedProduct(parentProduct, family)
    }
    return loadLegacyCompoundView(family)
  }

  const product = await getProductByHandle(handle)
  if (!product) return null

  const strength = toStrengthOption(product)
  const displayName = getProductDisplayName(product)
  const enrichment = enrichmentFor(handle)
  const meta = (product.metadata || {}) as Record<string, unknown>

  return {
    parentHandle: handle,
    displayName,
    displaySubtitle: getProductDisplaySubtitle(product),
    categoryLabel:
      enrichment.category ||
      storefrontCategoryLabelForProduct(
        handle,
        displayName,
        String(product.metadata?.source_category || "")
      ),
    isCompound: false,
    strengths: [strength],
    casNumber: pickMeta(meta, enrichment, "cas_number", "N/A"),
    molecularFormula: pickMeta(meta, enrichment, "molecular_formula", "N/A"),
    molecularWeight: pickMeta(meta, enrichment, "molecular_weight", "N/A"),
    storage: pickMeta(meta, enrichment, "storage", "-20°C lyophilized"),
    appearance: pickMeta(meta, enrichment, "appearance", "Lyophilized powder"),
    sequence: pickMeta(meta, enrichment, "sequence", "N/A"),
    researchSummary: ""
  }
}

export async function loadStrengthSideData(strengths: CompoundStrengthOption[]) {
  const reviewsByStrength: Record<string, ProductReviewsResponse> = {}

  const sharedProductId = strengths[0]?.productId
  const sharedHandle = strengths[0]?.handle
  const sharedReviews =
    sharedProductId &&
    strengths.every(
      (strength) =>
        strength.productId === sharedProductId && strength.handle === sharedHandle
    )
      ? await listProductReviews({
          productHandle: sharedHandle,
          productId: sharedProductId
        })
      : null

  const [coasByStrength, reviewEntries] = await Promise.all([
    listCoasForStrengths(
      strengths.map((strength) => ({
        strengthKey: strength.strengthKey,
        variantIds: strength.variants.map((variant) => variant.id),
        catalogHandles: [strength.handle]
      }))
    ),
    Promise.all(
      strengths.map(async (strength) => {
        const reviews =
          sharedReviews ||
          (await listProductReviews({
            productHandle: strength.handle,
            productId: strength.productId
          })) ||
          emptyProductReviews(strength.handle)
        return [strength.strengthKey, reviews] as const
      })
    )
  ])

  for (const [strengthKey, reviews] of reviewEntries) {
    reviewsByStrength[strengthKey] = reviews
  }

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

/** Parent-URL SEO label: all strengths, e.g. "BPC-157 (5mg / 10mg)". */
export function compoundSeoProductName(view: CompoundProductView): string {
  return formatProductLabelWithStrengths(
    view.displayName,
    view.strengths.map((strength) => strength.strengthLabel)
  )
}

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
    const label = storefrontCategoryLabelForProduct(
      product.handle,
      getProductDisplayName(product),
      String(product.metadata?.source_category || "")
    )
    return label === view.categoryLabel
  })

  return dedupeProductsByCompound(sameCategory).slice(0, limit)
}
