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

/**
 * Per-product, per-slot alt overrides for people-focused editorial illustrations (0-based).
 */
const PEOPLE_ILLUSTRATION_ALT_OVERRIDES: Record<string, Record<number, string>> = {
  "bpc-157": {
    0: "Scientist comparing BPC-157 and TB-500 research vials in a laboratory",
    1: "Two lab researchers examining a BPC-157 peptide vial together under a lab lamp",
    2: "Female lab scientist using a micropipette to prepare a BPC-157 research vial",
  },
  sermorelin: {
    0: "Research scientist reviewing growth hormone axis data beside a peptide research vial",
    1: "Two lab researchers examining a sermorelin peptide vial together under a lab lamp",
    2: "Female lab scientist using a micropipette to prepare a sermorelin research vial",
  },
}

/** Shared human-activity editorial assets for the long-form research section. */
const EDITORIAL_LAB_COLLABORATION = "/images/overview/_editorial/lab-collaboration.webp"
const EDITORIAL_LAB_PIPETTE = "/images/overview/_editorial/lab-pipette.webp"
const EDITORIAL_LAB_GH_RESEARCH = "/images/overview/_editorial/lab-gh-axis-research.webp"
const EDITORIAL_LAB_COMPARISON = "/images/overview/_editorial/lab-comparison-bpc-tb500.jpg"

const EDITORIAL_SLOT1_BY_HANDLE: Record<string, string> = {
  "bpc-157": EDITORIAL_LAB_COMPARISON,
  sermorelin: EDITORIAL_LAB_GH_RESEARCH,
}

function editorialOverviewPaths(parentHandle: string): string[] {
  const handle = parentHandle.trim().toLowerCase()
  return [
    EDITORIAL_SLOT1_BY_HANDLE[handle] || EDITORIAL_LAB_GH_RESEARCH,
    EDITORIAL_LAB_COLLABORATION,
    EDITORIAL_LAB_PIPETTE,
  ]
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
  if (input.index === 0 && override?.trim() && !input.src.includes("/_editorial/")) {
    return override.trim()
  }

  const peopleAlt =
    PEOPLE_ILLUSTRATION_ALT_OVERRIDES[input.parentHandle.trim().toLowerCase()]?.[input.index]
  if (peopleAlt) return peopleAlt

  if (input.src.includes("/_editorial/")) {
    if (input.index === 0) {
      return `Researchers reviewing ${baseName} peptide data in a laboratory setting`
    }
    if (input.index === 1) {
      return `Lab team collaborating on ${baseName} research protocols`
    }
    return `Scientist preparing ${baseName} research samples with a micropipette`
  }

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
 * Overview article images for the long-form research section.
 * Curated catalog products use shared human-activity editorial illustrations
 * instead of isolated vial renders; others fall back to gallery photos only.
 */
export function buildOverviewImages(
  parentHandle: string,
  galleryImages: string[],
  productName: string,
  categoryLabel: string
): ProductOverviewImage[] {
  const handle = parentHandle.trim().toLowerCase()

  if (CURATED_HANDLES.has(handle)) {
    return editorialOverviewPaths(handle).map((src, index) => ({
      src,
      alt: overviewSeoAlt({
        productName,
        parentHandle,
        categoryLabel,
        src,
        index,
      }),
    }))
  }

  const unique: string[] = []

  for (const src of getCuratedOverviewImagePaths(parentHandle)) {
    uniquePush(unique, src)
  }

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
      index,
    }),
  }))
}
