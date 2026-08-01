import overviewManifest from "@/lib/overview-images.generated.json"
import { categorySlugFromLabel } from "@/lib/categories"
import { categoryArtForSlug } from "@/lib/revamp/category-art"
import {
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"

export type ProductOverviewImage = {
  src: string
  alt: string
}

type ProductForm = "vial" | "capsule" | "nasal"

const SLOTS = [1, 2, 3] as const

const CURATED_HANDLES = new Set(
  (overviewManifest as { handles?: string[] }).handles?.map((handle) => handle.toLowerCase()) || []
)

const LAB_CONTEXT_IMAGES = [
  "/images/blog/lab-vial-presentation.jpg",
  "/images/blog/lab-synthesizer.jpg"
] as const

/** Editorial AI assets at /images/overview/{handle}-{1,2,3}.png when manifest lists a complete set. */
export function getCuratedOverviewImagePaths(parentHandle: string): string[] {
  const handle = parentHandle.trim().toLowerCase()
  if (!CURATED_HANDLES.has(handle)) return []
  return SLOTS.map((slot) => `/images/overview/${handle}-${slot}.png`)
}

function uniquePush(list: string[], src: string | null | undefined) {
  const value = String(src || "").trim()
  if (!value || list.includes(value)) return
  list.push(value)
}

function categoryContextImage(categoryLabel: string): string | null {
  const slug = String(categorySlugFromLabel(categoryLabel) || "")
  if (!slug) return null
  const art = categoryArtForSlug(slug, categoryLabel)
  return art.image || null
}

function detectProductForm(parentHandle: string, productName: string): ProductForm {
  const haystack = `${parentHandle} ${productName}`.toLowerCase()
  if (haystack.includes("nasal") || haystack.includes("spray")) return "nasal"
  if (haystack.includes("capsule") || haystack.includes("softgel")) return "capsule"
  return "vial"
}

function overviewAltFor(input: {
  baseName: string
  form: ProductForm
  categoryLabel: string
  src: string
  index: number
  primaryOverrideAlt?: string | null
}): string {
  const { baseName, form, categoryLabel, src, index, primaryOverrideAlt } = input
  if (index === 0 && primaryOverrideAlt?.trim()) return primaryOverrideAlt.trim()

  const isProductPhoto = src.includes("/products/")
  const isSide = /-side\./i.test(src) || src.toLowerCase().includes("side")
  const isCategory = src.includes("/cat-") || /\/v2\/cat-/i.test(src)
  const isLab = (LAB_CONTEXT_IMAGES as readonly string[]).includes(src)

  if (form === "capsule") {
    const capsuleName = baseName.replace(/\s*capsules?\s*$/i, "").trim() || baseName
    if (isProductPhoto && isSide) return `${capsuleName} capsules for sale bottle side view`
    if (isProductPhoto || index === 0) return `${capsuleName} capsules for sale`
    if (isCategory) return `${capsuleName} research capsules — ${categoryLabel}`
    return `${capsuleName} capsules for laboratory research`
  }

  if (form === "nasal") {
    const nasalName = baseName.replace(/\s*nasal\s*spray\s*$/i, "").trim() || baseName
    if (isProductPhoto && isSide) return `${nasalName} nasal spray for sale side view`
    if (isProductPhoto || index === 0) return `${nasalName} nasal spray for sale`
    if (isCategory) return `${nasalName} research nasal spray — ${categoryLabel}`
    return `${nasalName} nasal spray for laboratory research`
  }

  if (isProductPhoto && isSide) return `${baseName} peptide for sale vial side view`
  if (isProductPhoto || index === 0) return `${baseName} peptide for sale in vial`
  if (isCategory) return `${baseName} research peptide — ${categoryLabel}`
  if (isLab) return `${baseName} peptide for laboratory research`
  return `${baseName} research peptide from Tetrava Labs`
}

/**
 * Three distinct overview article images for any catalog product.
 * Prefer branded product photography, then category/lab context.
 * Generic curated blanks are last-resort fill only.
 */
export function buildOverviewImages(
  parentHandle: string,
  galleryImages: string[],
  productName: string,
  categoryLabel: string
): ProductOverviewImage[] {
  const baseName =
    stripStrengthFromDisplayName(normalizeTb500DisplayText(productName)) || "Research peptide"
  const form = detectProductForm(parentHandle, baseName)
  const primaryOverrideAlt = getProductSeoOverride(parentHandle)?.imageAlt

  const unique: string[] = []

  // 1) Branded product gallery (front + side) — product-specific, SEO-aligned
  for (const src of galleryImages) {
    if (unique.length >= 2) break
    uniquePush(unique, src)
  }

  // 2) Category editorial context
  uniquePush(unique, categoryContextImage(categoryLabel))

  // 3) Shared lab atmosphere
  for (const src of LAB_CONTEXT_IMAGES) {
    if (unique.length >= 3) break
    uniquePush(unique, src)
  }

  // 4) Curated AI blanks only if still short
  for (const src of getCuratedOverviewImagePaths(parentHandle)) {
    if (unique.length >= 3) break
    uniquePush(unique, src)
  }

  return unique.slice(0, 3).map((src, index) => ({
    src,
    alt: overviewAltFor({
      baseName,
      form,
      categoryLabel,
      src,
      index,
      primaryOverrideAlt
    })
  }))
}
