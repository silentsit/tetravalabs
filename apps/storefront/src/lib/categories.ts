import type { StoreProduct } from "@/lib/medusa"
import categorySlugsByHandle from "@/lib/category-slugs.generated.json"
import { categoryArt } from "@/lib/revamp/category-art"
import { sortProducts, type ProductSort } from "@/lib/sort-products"

export const STOREFRONT_CATEGORY_SLUGS = [
  "glp-1-research",
  "tissue-repair",
  "growth-hormone-axis",
  "longevity-neuropeptides",
  "metabolic-mitochondrial",
  "research-blends",
  "lab-supplies"
] as const

export type StorefrontCategorySlug = (typeof STOREFRONT_CATEGORY_SLUGS)[number]

const CATEGORY_NAME_BY_SLUG: Record<StorefrontCategorySlug, string> = {
  "glp-1-research": "GLP-1 Research",
  "tissue-repair": "Tissue Repair",
  "growth-hormone-axis": "Growth Hormone Axis",
  "longevity-neuropeptides": "Longevity & Neuropeptides",
  "metabolic-mitochondrial": "Metabolic & Mitochondrial",
  "research-blends": "Research Blends",
  "lab-supplies": "Lab Supplies"
}

/** Legacy URLs and old filter keys → current slug. */
const LEGACY_SLUG_ALIASES: Record<string, StorefrontCategorySlug> = {
  "glp-1-incretin": "glp-1-research",
  "supplies-reconstitution": "lab-supplies",
  "bpc-157-tb500": "tissue-repair",
  blends: "research-blends",
  "cjc-ipamorelin-ghrp": "growth-hormone-axis",
  "growth-hormone-axis": "growth-hormone-axis",
  "mitochondrial-metabolic-other": "metabolic-mitochondrial",
  "cosmetic-copper-tanning": "tissue-repair",
  "longevity-thymic-neuropeptides": "longevity-neuropeptides",
  "vitamins-injectables": "metabolic-mitochondrial",
  "legacy-catalog": "longevity-neuropeptides",
  "growth-factors": "tissue-repair"
}

const LEGACY_STOREFRONT_TO_SHEET: Record<string, string> = {
  "GLP-1 Research": "GLP-1 / Incretin",
  "Research Blends": "Blends",
  "Lab Supplies": "Supplies & Reconstitution"
}

const SOURCE_SHEET_CATEGORIES = new Set([
  "GLP-1 / Incretin",
  "BPC-157 / TB500",
  "Blends",
  "CJC / Ipamorelin / GHRP",
  "Growth Hormone Axis",
  "Mitochondrial / Metabolic Other",
  "Cosmetic / Copper / Tanning",
  "Longevity / Thymic / Neuropeptides",
  "Vitamins & Injectables",
  "Legacy Catalog",
  "Supplies & Reconstitution"
])

const BLEND_PRODUCTS = new Set([
  "BPC-157 + TB500 Blend",
  "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg",
  "Glow BPC-157 + TB500 + GHK-Cu",
  "Glow TB500 10mg + BPC-157 10mg + GHK-Cu 50mg",
  "CJC-1295 without DAC / Ipamorelin Blend",
  "CJC-1295 without DAC / Sermorelin / Ipamorelin Blend",
  "Cagrilintide + Semaglutide"
])

const GROWTH_FROM_GLP1 = new Set(["Sermorelin", "Tesamorelin"])

const GLP1_PRODUCTS = new Set([
  "Semaglutide",
  "Tirzepatide",
  "Retatrutide",
  "Cagrilintide",
  "Mazdutide",
  "Survodutide",
  "5-Amino-1MQ",
  "AOD-9604"
])

const SOURCE_CATEGORY_MAP: Record<string, StorefrontCategorySlug> = {
  "Supplies & Reconstitution": "lab-supplies",
  "BPC-157 / TB500": "tissue-repair",
  "Cosmetic / Copper / Tanning": "tissue-repair",
  "CJC / Ipamorelin / GHRP": "growth-hormone-axis",
  "Growth Hormone Axis": "growth-hormone-axis",
  "Longevity / Thymic / Neuropeptides": "longevity-neuropeptides",
  "Mitochondrial / Metabolic Other": "metabolic-mitochondrial",
  "Vitamins & Injectables": "metabolic-mitochondrial",
  "Legacy Catalog": "longevity-neuropeptides",
  Blends: "research-blends"
}

const catalogSlugMap = categorySlugsByHandle as Record<string, StorefrontCategorySlug>

export function slugifyCategory(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function normalizeCategorySlug(slug: string): StorefrontCategorySlug | string {
  const normalized = slug.toLowerCase()
  if (STOREFRONT_CATEGORY_SLUGS.includes(normalized as StorefrontCategorySlug)) {
    return normalized as StorefrontCategorySlug
  }
  return LEGACY_SLUG_ALIASES[normalized] || normalized
}

export function categorySlugFromLabel(label: string) {
  const slug = slugifyCategory(label)
  const normalized = normalizeCategorySlug(slug)
  if (STOREFRONT_CATEGORY_SLUGS.includes(normalized as StorefrontCategorySlug)) {
    return normalized
  }
  return LEGACY_SLUG_ALIASES[slug] || slug
}

export function categoryLabelFromSlug(slug: string, products: StoreProduct[]) {
  const normalized = normalizeCategorySlug(slug)
  if (typeof normalized === "string" && normalized in CATEGORY_NAME_BY_SLUG) {
    return CATEGORY_NAME_BY_SLUG[normalized as StorefrontCategorySlug]
  }

  for (const product of products) {
    const label = String(product.metadata?.source_category || "")
    if (label && categorySlugFromLabel(label) === slug.toLowerCase()) {
      return label
    }
  }

  return slug.replace(/-/g, " ")
}

function compoundNameFromProduct(product: StoreProduct) {
  const strength = product.metadata?.strength
  if (typeof strength === "string" && strength) {
    const suffix = ` ${strength}`
    if (product.title.endsWith(suffix)) {
      return product.title.slice(0, -suffix.length)
    }
  }
  return product.title
}

function normalizeSourceCategory(raw: string) {
  if (SOURCE_SHEET_CATEGORIES.has(raw)) return raw
  if (LEGACY_STOREFRONT_TO_SHEET[raw]) return LEGACY_STOREFRONT_TO_SHEET[raw]
  if (raw === "Growth Factors") return ""
  return raw
}

/** Mirrors packages/catalog/lib/storefront-categories.mjs */
export function resolveStorefrontCategorySlug(
  name: string,
  sourceCategory: string
): StorefrontCategorySlug {
  if (BLEND_PRODUCTS.has(name) || [...BLEND_PRODUCTS].some((blend) => name.startsWith(`${blend} `))) {
    return "research-blends"
  }
  if (sourceCategory === "GLP-1 / Incretin") {
    if (GROWTH_FROM_GLP1.has(name)) return "growth-hormone-axis"
    if (GLP1_PRODUCTS.has(name)) return "glp-1-research"
    return "metabolic-mitochondrial"
  }
  return SOURCE_CATEGORY_MAP[sourceCategory] || "longevity-neuropeptides"
}

export function resolveProductCategorySlug(product: StoreProduct): StorefrontCategorySlug {
  const fromCatalog = catalogSlugMap[product.handle]
  if (fromCatalog) return fromCatalog

  const sourceCategory = normalizeSourceCategory(String(product.metadata?.source_category || ""))
  const compoundName = compoundNameFromProduct(product)
  return resolveStorefrontCategorySlug(compoundName, sourceCategory)
}

export function groupProductsByCategory(products: StoreProduct[]) {
  const groups = new Map<string, StoreProduct[]>()

  for (const product of products) {
    const slug = resolveProductCategorySlug(product)
    const existing = groups.get(slug) || []
    existing.push(product)
    groups.set(slug, existing)
  }

  return [...groups.entries()]
    .map(([slug, items]) => ({
      name: CATEGORY_NAME_BY_SLUG[slug as StorefrontCategorySlug] || slug,
      slug,
      count: items.length,
      products: items
    }))
    .sort((a, b) => b.count - a.count)
}

export function getRelatedProducts(product: StoreProduct, products: StoreProduct[], limit = 4) {
  const categorySlug = resolveProductCategorySlug(product)
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id && resolveProductCategorySlug(candidate) === categorySlug
    )
    .slice(0, limit)
}

export function filterProductsByCategorySlug(products: StoreProduct[], slug: string) {
  if (slug.toLowerCase() === "growth-factors") {
    return products.filter((product) => {
      const productSlug = resolveProductCategorySlug(product)
      return !["glp-1-research", "research-blends", "lab-supplies"].includes(productSlug)
    })
  }

  const normalized = normalizeCategorySlug(slug)
  return products.filter((product) => resolveProductCategorySlug(product) === normalized)
}

export type StorefrontCategorySection = {
  slug: string
  name: string
  description: string
  products: StoreProduct[]
}

/** Group and order products for the full-catalog shop view. */
export function getStorefrontCategorySections(
  products: StoreProduct[],
  sort: ProductSort
): StorefrontCategorySection[] {
  return categoryArt
    .map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      products: sortProducts(filterProductsByCategorySlug(products, cat.slug), sort)
    }))
    .filter((section) => section.products.length > 0)
}
