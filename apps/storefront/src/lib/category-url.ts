/** Lightweight category URL helpers for Edge middleware (no Medusa/Sanity imports). */

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

export function isStorefrontCategorySlug(slug: string): slug is StorefrontCategorySlug {
  return (STOREFRONT_CATEGORY_SLUGS as readonly string[]).includes(slug)
}

/** Retired category path segments and old shop filter keys → current slug. */
export const LEGACY_CATEGORY_SLUG_ALIASES: Record<string, StorefrontCategorySlug> = {
  "glp-1": "glp-1-research",
  "glp-1-incretin": "glp-1-research",
  "supplies-reconstitution": "lab-supplies",
  supplies: "lab-supplies",
  "bpc-157-tb500": "tissue-repair",
  blends: "research-blends",
  "cjc-ipamorelin-ghrp": "growth-hormone-axis",
  "mitochondrial-metabolic-other": "metabolic-mitochondrial",
  "cosmetic-copper-tanning": "tissue-repair",
  "longevity-thymic-neuropeptides": "longevity-neuropeptides",
  "vitamins-injectables": "metabolic-mitochondrial",
  "legacy-catalog": "longevity-neuropeptides",
  "growth-factors": "tissue-repair"
}

export function canonicalizeCategorySlug(slug: string): StorefrontCategorySlug | null {
  const normalized = slug.toLowerCase()
  if (isStorefrontCategorySlug(normalized)) return normalized
  return LEGACY_CATEGORY_SLUG_ALIASES[normalized] || null
}
