import overviewManifest from "@/lib/overview-images.generated.json"
import { categorySlugFromLabel } from "@/lib/categories"
import { categoryArtForSlug } from "@/lib/revamp/category-art"

export type ProductOverviewImage = {
  src: string
  alt: string
}

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

/**
 * Three distinct overview article images for any catalog product.
 * 1) Curated editorial set when present
 * 2) Product gallery front + side
 * 3) Category lab context, then shared lab stock
 */
export function buildOverviewImages(
  parentHandle: string,
  galleryImages: string[],
  productName: string,
  categoryLabel: string
): ProductOverviewImage[] {
  const unique: string[] = []

  for (const src of getCuratedOverviewImagePaths(parentHandle)) {
    uniquePush(unique, src)
  }

  for (const src of galleryImages) {
    if (unique.length >= 3) break
    uniquePush(unique, src)
  }

  uniquePush(unique, categoryContextImage(categoryLabel))

  for (const src of LAB_CONTEXT_IMAGES) {
    if (unique.length >= 3) break
    uniquePush(unique, src)
  }

  const alts = [
    `${productName} research vial from Tetrava Labs`,
    `${productName} laboratory research preparation`,
    `${productName} analytical documentation and lot records`
  ]

  return unique.slice(0, 3).map((src, index) => ({
    src,
    alt: alts[index] || `${productName} research documentation`
  }))
}
