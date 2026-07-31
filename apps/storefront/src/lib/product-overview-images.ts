import { FEATURED_PRODUCT_HANDLES } from "@/lib/product-image-map"

const SLOTS = [1, 2, 3] as const

/** AI-generated editorial images for featured PDP overview articles. */
export function getCuratedOverviewImagePaths(parentHandle: string): string[] {
  const handle = parentHandle.trim().toLowerCase()
  if (!(FEATURED_PRODUCT_HANDLES as readonly string[]).includes(handle)) return []
  return SLOTS.map((slot) => `/images/overview/${handle}-${slot}.png`)
}
