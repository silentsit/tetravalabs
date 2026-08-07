import overviewManifest from "@/lib/overview-images.generated.json"
import {
  normalizeTb500DisplayText,
  stripStrengthFromDisplayName
} from "@/lib/revamp/product-visual"
import { getProductSeoOverride } from "@/lib/product-seo-overrides"

export type ProductOverviewImage = {
  src: string
  alt: string
}

type ProductForm = "vial" | "capsule" | "nasal" | "supply"

const SLOTS = [1, 2, 3] as const

const CURATED_HANDLES = new Set(
  (overviewManifest as { handles?: string[] }).handles?.map((handle) => handle.toLowerCase()) || []
)

/** Editorial assets at /images/overview/{handle}-{1,2,3}.webp when manifest lists a complete set. */
export function getCuratedOverviewImagePaths(parentHandle: string): string[] {
  const handle = parentHandle.trim().toLowerCase()
  if (!CURATED_HANDLES.has(handle)) return []
  return SLOTS.map((slot) => `/images/overview/${handle}-${slot}.webp`)
}

function uniquePush(list: string[], src: string | null | undefined) {
  const value = String(src || "").trim()
  if (!value || list.includes(value)) return
  list.push(value)
}

function detectProductForm(parentHandle: string, productName: string): ProductForm {
  const haystack = `${parentHandle} ${productName}`.toLowerCase()
  if (haystack.includes("nasal") || haystack.includes("spray")) return "nasal"
  if (haystack.includes("capsule") || haystack.includes("softgel")) return "capsule"
  if (
    haystack.includes("water") ||
    haystack.includes("alcohol") ||
    haystack.includes("acetic") ||
    haystack.includes("lipo-c") ||
    haystack.includes("lemon-bottle") ||
    haystack.includes("l-carnitine") ||
    haystack.includes("lab-supplies")
  ) {
    return "supply"
  }
  return "vial"
}

function seoBaseName(productName: string): string {
  return (
    stripStrengthFromDisplayName(normalizeTb500DisplayText(productName)) || "Research peptide"
  )
}

/** SEO-focused alt text for overview article images — unique wording per slot. */
export function overviewSeoAlt(input: {
  productName: string
  parentHandle: string
  categoryLabel: string
  src: string
  index: number
}): string {
  const baseName = seoBaseName(input.productName)
  const form = detectProductForm(input.parentHandle, baseName)
  const override = getProductSeoOverride(input.parentHandle)?.imageAlt
  if (input.index === 0 && override?.trim()) return override.trim()

  const category = input.categoryLabel.trim() || "research"

  if (form === "capsule") {
    const name = baseName.replace(/\s*capsules?\s*$/i, "").trim() || baseName
    if (input.index === 0) return `${name} capsules for sale`
    if (input.index === 1) return `Buy ${name} capsules online for laboratory research`
    return `${name} research capsules — ${category}`
  }

  if (form === "nasal") {
    const name = baseName.replace(/\s*nasal\s*spray\s*$/i, "").trim() || baseName
    if (input.index === 0) return `${name} nasal spray for sale`
    if (input.index === 1) return `Buy ${name} nasal spray online for research`
    return `${name} research nasal spray — ${category}`
  }

  if (form === "supply") {
    if (input.index === 0) return `${baseName} for sale for laboratory research`
    if (input.index === 1) return `Buy ${baseName} online — lab supply`
    return `${baseName} research lab supply — ${category}`
  }

  // vial / peptide default
  if (input.index === 0) return `${baseName} peptide for sale in vial`
  if (input.index === 1) return `Buy ${baseName} peptide online — research use only`
  if (/mots-c/i.test(baseName) || /mots-c/i.test(input.src)) {
    return `${baseName} mitochondrial research peptide for sale`
  }
  return `${baseName} research peptide for sale — ${category}`
}

/**
 * Overview article images: product-specific curated editorial only.
 * Shared category/lab stock is never reused across PDPs.
 * Until a curated triple exists, fall back to that product's own gallery
 * photos only (never another product's assets).
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

  // Product-owned gallery only if curated set is incomplete — never shared stock.
  if (unique.length < 3) {
    for (const src of galleryImages) {
      if (unique.length >= 3) break
      uniquePush(unique, src)
    }
  }

  return unique.slice(0, 3).map((src, index) => ({
    src,
    alt: overviewSeoAlt({
      productName,
      parentHandle,
      categoryLabel,
      src,
      index
    })
  }))
}
