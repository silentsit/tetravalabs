import { type StorefrontCategorySlug } from "@/lib/category-url"

/** Scientific / catalog names. Used in SEO titles and slug resolution. */
export const CATEGORY_NAME_BY_SLUG: Record<StorefrontCategorySlug, string> = {
  "glp-1-research": "GLP-1 Research",
  "tissue-repair": "Tissue Repair",
  "growth-hormone-axis": "Growth Hormone Axis",
  "longevity-neuropeptides": "Longevity & Neuropeptides",
  "metabolic-mitochondrial": "Metabolic & Mitochondrial",
  "research-blends": "Research Blends",
  "lab-supplies": "Lab Supplies"
}

/**
 * Consumer / practical labels shown in brackets after the catalog name.
 * Longevity holds three consumer rows from the same catalog bucket.
 */
export const CATEGORY_CONSUMER_LABEL_BY_SLUG: Partial<Record<StorefrontCategorySlug, string>> = {
  "glp-1-research": "Weight Loss & Metabolic",
  "tissue-repair": "Healing & Tissue Repair",
  "growth-hormone-axis": "Growth Hormone Secretagogues",
  "longevity-neuropeptides": "Longevity, Cognitive & Sleep",
  "metabolic-mitochondrial": "Weight Loss & Metabolic"
}

export function stripCategoryConsumerSuffix(label: string) {
  return label.replace(/\s*\([^)]*\)\s*$/g, "").trim()
}

export function categoryDisplayName(slug: string, name?: string): string {
  const shortName =
    stripCategoryConsumerSuffix(name || "") ||
    CATEGORY_NAME_BY_SLUG[slug as StorefrontCategorySlug] ||
    name ||
    slug
  const consumer = CATEGORY_CONSUMER_LABEL_BY_SLUG[slug as StorefrontCategorySlug]
  return consumer ? `${shortName} (${consumer})` : shortName
}

export const CATEGORY_DISPLAY_NAME_BY_SLUG = Object.fromEntries(
  (Object.keys(CATEGORY_NAME_BY_SLUG) as StorefrontCategorySlug[]).map((slug) => [
    slug,
    categoryDisplayName(slug)
  ])
) as Record<StorefrontCategorySlug, string>

const HOMEPAGE_KEEP_CATALOG = new Set<StorefrontCategorySlug>([
  "growth-hormone-axis",
  "metabolic-mitochondrial"
])

/** Homepage browse tiles use the consumer label except two catalog names. */
export function homepageCategoryTitle(slug: string): string {
  const key = slug as StorefrontCategorySlug
  if (HOMEPAGE_KEEP_CATALOG.has(key)) return CATEGORY_NAME_BY_SLUG[key]
  return CATEGORY_CONSUMER_LABEL_BY_SLUG[key] || CATEGORY_NAME_BY_SLUG[key] || slug
}
