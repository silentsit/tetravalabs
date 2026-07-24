/**
 * Maps product handles → v2 PNG assets in apps/storefront/public/products/v2/.
 * Source archive: v2-photos-white/ at repo root (npm run sync:v2-images).
 * Regenerate mappings: npm run map:images
 * Homepage featured row uses the same PNG map for curated heroes.
 * Gallery front+side: tools/label-pipeline/scripts/apply-shots-to-storefront.py
 */
import compoundFamilies from "@/lib/compound-families.generated.json"
import generatedMap from "@/lib/product-image-map.generated.json"
import galleryMap from "@/lib/product-gallery-images.generated.json"

const V2_BASE = "/products/v2"
const GENERIC_FALLBACK = "/v2/vial-single.jpg"

export const FEATURED_PRODUCT_HANDLES = [
  "bpc-157",
  "semaglutide",
  "tirzepatide",
  "retatrutide",
  "ghk-cu",
  "ipamorelin",
  "tb500",
  "hgh-191aa"
]

const productImageMap = generatedMap as Record<string, string>
const productGalleryMap = galleryMap as Record<string, string[]>

type FamilyMember = { legacy_slug: string; strength_key: string }

/** Non-compound / single-SKU base handles → default v2 image. */
const LEGACY_BASE_IMAGES: Record<string, string> = {
  "bacteriostatic-water": `${V2_BASE}/bac-water-10ml.png`,
  "nad": `${V2_BASE}/nad-100mg.png`
}

function strengthSortKey(strengthKey: string): number {
  const iu = strengthKey.match(/^(\d+)-iu$/i)
  if (iu) return Number(iu[1])
  const decimalMg = strengthKey.match(/^(\d+)-(\d+)mg$/i)
  if (decimalMg) return Number(`${decimalMg[1]}.${decimalMg[2]}`)
  const num = strengthKey.match(/^(\d+(?:\.\d+)?)/)
  return num ? Number(num[1]) : 0
}

/**
 * Shelf/PDP image for a consolidated parent: mid strength when the family
 * has an odd count, otherwise the smallest strength.
 */
export function getCompoundShelfImageHandle(parentHandle: string): string | null {
  const family = (compoundFamilies as Record<string, { members: FamilyMember[] }>)[
    parentHandle
  ]
  if (!family?.members?.length) return null

  const sorted = [...family.members].sort(
    (a, b) => strengthSortKey(a.strength_key) - strengthSortKey(b.strength_key)
  )
  const index = sorted.length % 2 === 1 ? Math.floor(sorted.length / 2) : 0
  return sorted[index]?.legacy_slug || null
}

function compoundFamilyImage(handle: string): string | null {
  const memberHandle = getCompoundShelfImageHandle(handle)
  if (!memberHandle) return null
  return productImageMap[memberHandle] || null
}

function autoMatchImage(handle: string): string | null {
  const patterns: [RegExp, string][] = [
    [/aod.?9604.*5/i, `${V2_BASE}/aod9604-5mg.png`],
    [/aod.?9604.*10/i, `${V2_BASE}/aod9604-10mg.png`],
    [/bpc.?157.*5mg/i, `${V2_BASE}/bpc-157-5mg.png`],
    [/semaglutide.*5mg/i, `${V2_BASE}/semaglutide-5mg.png`],
    [/tirzepatide.*10mg/i, `${V2_BASE}/tirzepatide-10mg.png`],
    [/ghrp-2.*5/i, `${V2_BASE}/ghrp2-5mg.png`],
    [/ghrp-6.*5/i, `${V2_BASE}/ghrp6-5mg.png`]
  ]

  for (const [pattern, image] of patterns) {
    if (pattern.test(handle)) return image
  }

  return null
}

/** Returns mapped v2 asset (PNG preferred via generated map). */
export function getV2ProductImage(handle: string): string | null {
  if (productImageMap[handle]) return productImageMap[handle]
  const fromFamily = compoundFamilyImage(handle)
  if (fromFamily) return fromFamily
  if (LEGACY_BASE_IMAGES[handle]) return LEGACY_BASE_IMAGES[handle]
  return autoMatchImage(handle)
}

/** Primary resolver for shop, PDP, cart, and search. */
export function getProductImage(handle: string): string {
  return getV2ProductImage(handle) ?? GENERIC_FALLBACK
}

/**
 * PDP gallery images: primary (front) + optional side shot.
 * Shop/cart keep using getProductImage() (front only).
 */
export function getProductGalleryImages(handle: string): string[] {
  const mapped = productGalleryMap[handle]
  if (mapped?.length) return mapped

  const memberHandle = getCompoundShelfImageHandle(handle)
  if (memberHandle) {
    const memberGallery = productGalleryMap[memberHandle]
    if (memberGallery?.length) return memberGallery
    const memberImage = productImageMap[memberHandle]
    if (memberImage) return [memberImage]
  }

  return [getProductImage(handle)]
}

/** Featured row — same v2-photos PNG as shop when mapped. */
export function getFeaturedProductImage(handle: string): string {
  return getProductImage(handle)
}

export function isFeaturedProductHandle(handle: string): boolean {
  return FEATURED_PRODUCT_HANDLES.includes(handle)
}

/** @deprecated Use getProductImage; kept for imports that referenced featured PNG map. */
export const FEATURED_PNG_IMAGES = Object.fromEntries(
  FEATURED_PRODUCT_HANDLES.map((handle) => [handle, getProductImage(handle)])
)
