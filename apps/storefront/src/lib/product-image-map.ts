/**
 * Maps product handles → v2 PNG assets in apps/storefront/public/products/v2/.
 * Source archive: v2-photos-white/ at repo root (npm run sync:v2-images).
 * Regenerate mappings: npm run map:images
 * Homepage featured row uses the same PNG map for curated heroes.
 */
import generatedMap from "@/lib/product-image-map.generated.json"

const V2_BASE = "/products/v2"
const GENERIC_FALLBACK = "/v2/vial-single.jpg"

export const FEATURED_PRODUCT_HANDLES = [
  "bpc-157-5mg",
  "semaglutide-5mg",
  "tirzepatide-10mg",
  "retatrutide-5mg",
  "ghk-cu-50mg",
  "ipamorelin-5mg",
  "tb500-10mg",
  "hgh-191aa-10-iu"
]

const productImageMap = generatedMap as Record<string, string>

/** Legacy Medusa base handles → default v2 image. */
const LEGACY_BASE_IMAGES: Record<string, string> = {
  "bpc-157": `${V2_BASE}/bpc-157-5mg.png`,
  "semaglutide": `${V2_BASE}/semaglutide-5mg.png`,
  "tirzepatide": `${V2_BASE}/tirzepatide-5mg.png`,
  "retatrutide": `${V2_BASE}/retatrutide-5mg.png`,
  "ghk-cu": `${V2_BASE}/ghk-cu-50mg.png`,
  "ipamorelin": `${V2_BASE}/ipamorelin-5mg.png`,
  "tb500": `${V2_BASE}/tb500-5mg.png`,
  "hgh-191aa": `${V2_BASE}/hgh-10iu.png`,
  "bacteriostatic-water": `${V2_BASE}/bac-water-10ml.png`,
  "nad": `${V2_BASE}/nad-100mg.png`
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
  if (LEGACY_BASE_IMAGES[handle]) return LEGACY_BASE_IMAGES[handle]
  return autoMatchImage(handle)
}

/** Primary resolver for shop, PDP, cart, and search. */
export function getProductImage(handle: string): string {
  return getV2ProductImage(handle) ?? GENERIC_FALLBACK
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
