import type { StoreProduct } from "@/lib/medusa"
import { getProductPriceCents, getVariantPriceCents } from "@/lib/product-price"
import { getV2ProductImage } from "@/lib/product-image-map"
import productImageMap from "@/lib/revamp/product-image-map.json"

type AliasEntry = { slug: string; image: string }

const kimiImages = productImageMap.kimi as Record<string, string>
const handleAliases = productImageMap.aliases as Record<string, AliasEntry>

const GENERIC_VIAL = "/v2/vial-single.jpg"
const GENERIC_BLEND = "/v2/cat-blends.jpg"

/** Files that exist under public/products (and v2 product shots). */
const AVAILABLE_IMAGE_FILES = new Set([
  "5amino1mq-10mg.jpg",
  "5amino1mq-5mg.jpg",
  "acetic-acid-3ml.jpg",
  "acetic-acid-3ml.png",
  "adipotide-2mg.jpg",
  "aicar-50mg.jpg",
  "aod9604-5mg.jpg",
  "ara-290-10mg.jpg",
  "b-12-10mg.jpg",
  "bac-water-10ml.jpg",
  "bac-water-10ml.png",
  "benzyl-alcohol-3ml.jpg",
  "blend-bpc157-tb500.jpg",
  "blend-cjc-ipamorelin.jpg",
  "bpc-157-capsules.png",
  "bpc157-5mg.jpg",
  "bpc157-caps.jpg",
  "bremelanotide-10mg.jpg",
  "cagrilintide-5mg.jpg",
  "cjc1295-5mg.jpg",
  "dermorphin-5mg.jpg",
  "dsip-5mg.jpg",
  "epithalon-10mg.jpg",
  "foxo4-dri-10mg.jpg",
  "ghk-cu-100mg.jpg",
  "ghrp-2-5mg.jpg",
  "ghrp-6-5mg.jpg",
  "glutathione-600mg.jpg",
  "glow-blend-30mg.jpg",
  "gonadorelin-2mg.jpg",
  "hcg-5000iu.jpg",
  "hexarelin-2mg.jpg",
  "hgh-10iu.jpg",
  "hmg-75iu.jpg",
  "igf1-lr3-1mg.jpg",
  "ipamorelin-5mg.jpg",
  "kisspeptin-10-5mg.jpg",
  "kpv-5mg.jpg",
  "l-carnitine-600mg.jpg",
  "l-glu-100mg.jpg",
  "lemon-bottle-10ml.jpg",
  "lipo-c-10ml.jpg",
  "ll37-5mg.jpg",
  "mazdutide-5mg.jpg",
  "melanotan1-10mg.jpg",
  "melanotan2-10mg.jpg",
  "mgf-2mg.jpg",
  "mk677-5mg.jpg",
  "mots-c-5mg.jpg",
  "nad-plus-100mg.jpg",
  "nad-plus-500mg.jpg",
  "oxytocin-2mg.jpg",
  "peg-mgf-2mg.jpg",
  "pinealon-caps.jpg",
  "pinealon-capsules.png",
  "retatrutide-5mg.jpg",
  "selank-5mg.jpg",
  "semaglutide-5mg.jpg",
  "semax-5mg.jpg",
  "sermorelin-5mg.jpg",
  "snap-8-10mg.jpg",
  "ss-31-10mg.jpg",
  "survodutide-5mg.jpg",
  "tb500-10mg.jpg",
  "tb500-5mg.jpg",
  "tesamorelin-5mg.jpg",
  "thymalin-10mg.jpg",
  "thymosin-5mg.jpg",
  "tirzepatide-5mg.jpg",
  "vip-10mg.jpg",
  "vial-blend.jpg",
  "vial-water.jpg"
])

const COMPOUND_IMAGES: Record<string, string> = {
  "5-amino-1mq": "/products/5amino1mq-10mg.jpg",
  "semaglutide": "/products/semaglutide-5mg.jpg",
  "tirzepatide": "/products/tirzepatide-5mg.jpg",
  "retatrutide": "/products/retatrutide-5mg.jpg",
  "cagrilintide": "/products/cagrilintide-5mg.jpg",
  mazdutide: "/products/mazdutide-5mg.jpg",
  survodutide: "/products/survodutide-5mg.jpg",
  "sermorelin": "/products/sermorelin-5mg.jpg",
  "tesamorelin": "/products/tesamorelin-5mg.jpg",
  "aod-9604": "/products/aod9604-5mg.jpg",
  "bpc-157": "/products/bpc157-5mg.jpg",
  tb500: "/products/tb500-10mg.jpg",
  "ghk-cu": "/products/ghk-cu-100mg.jpg",
  ipamorelin: "/products/ipamorelin-5mg.jpg",
  "cjc-1295-with-dac": "/products/cjc1295-5mg.jpg",
  "cjc-1295-without-dac": "/products/cjc1295-5mg.jpg",
  "mk-677": "/products/mk677-5mg.jpg",
  "melanotan-2": "/products/melanotan2-10mg.jpg",
  "hgh-191aa": "/products/hgh-10iu.jpg",
  hcg: "/products/hcg-5000iu.jpg",
  "igf-1-lr3": "/products/igf1-lr3-1mg.jpg",
  dsip: "/products/dsip-5mg.jpg",
  selank: "/products/selank-5mg.jpg",
  semax: "/products/semax-5mg.jpg",
  "thymosin-alpha-1": "/products/thymosin-5mg.jpg",
  vip: "/products/vip-10mg.jpg",
  bremelanotide: "/products/bremelanotide-10mg.jpg",
  "ll-37": "/products/ll37-5mg.jpg",
  epithalon: "/products/epithalon-10mg.jpg",
  glutathione: "/products/glutathione-600mg.jpg",
  nad: "/products/nad-plus-100mg.jpg",
  adipotide: "/products/adipotide-2mg.jpg",
  aicar: "/products/aicar-50mg.jpg",
  "ara-290": "/products/ara-290-10mg.jpg",
  "b-12": "/products/b-12-10mg.jpg",
  dermorphin: "/products/dermorphin-5mg.jpg",
  "foxo4-dri": "/products/foxo4-dri-10mg.jpg",
  "ghrp-2-acetate": "/products/ghrp-2-5mg.jpg",
  "ghrp-6-acetate": "/products/ghrp-6-5mg.jpg",
  gonadorelin: "/products/gonadorelin-2mg.jpg",
  "hexarelin-acetate": "/products/hexarelin-2mg.jpg",
  hmg: "/products/hmg-75iu.jpg",
  "kisspeptin-10": "/products/kisspeptin-10-5mg.jpg",
  kpv: "/products/kpv-5mg.jpg",
  "l-carnitine": "/products/l-carnitine-600mg.jpg",
  "l-glu": "/products/l-glu-100mg.jpg",
  "lemon-bottle": "/products/lemon-bottle-10ml.jpg",
  "lipo-c": "/products/lipo-c-10ml.jpg",
  mgf: "/products/mgf-2mg.jpg",
  "melanotan-1": "/products/melanotan1-10mg.jpg",
  "mots-c": "/products/mots-c-5mg.jpg",
  "oxytocin-acetate": "/products/oxytocin-2mg.jpg",
  "peg-mgf": "/products/peg-mgf-2mg.jpg",
  "snap-8": "/products/snap-8-10mg.jpg",
  "ss-31": "/products/ss-31-10mg.jpg",
  thymalin: "/products/thymalin-10mg.jpg",
  "benzyl-alcohol": "/products/benzyl-alcohol-3ml.jpg",
  "acetic-acid-water": "/products/acetic-acid-3ml.png",
  "bacteriostatic-water": "/products/bac-water-10ml.png",
  "bpc-157-capsules": "/products/bpc-157-capsules.png",
  "pinealon-capsules": "/products/pinealon-capsules.png",
  "bpc-157-5mg-tb500-5mg": "/products/blend-bpc157-tb500.jpg",
  "cagrilintide-semaglutide": "/products/cagrilintide-5mg.jpg",
  "glow-bpc-157-tb500-ghk-cu": "/products/glow-blend-30mg.jpg",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg": "/products/glow-blend-30mg.jpg"
}

const visualFallback: Record<string, string> = {
  vial: GENERIC_VIAL,
  capsule: "/products/bottle-capsules.jpg",
  water: "/products/vial-water.jpg",
  water_solution: "/products/vial-water.jpg",
  blend: GENERIC_BLEND,
  hgh: "/products/hgh-10iu.jpg",
  liquid: "/products/vial-water.jpg"
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function fileExistsAt(path: string) {
  const filename = path.split("/").pop()
  return Boolean(filename && AVAILABLE_IMAGE_FILES.has(filename))
}

function imagePathCandidates(handle: string): string[] {
  const paths = new Set<string>()
  const add = (path: string) => paths.add(path)

  add(`/products/${handle}.jpg`)
  add(`/products/${handle}.png`)
  add(`/products/${handle.replace(/-/g, "")}.jpg`)
  add(`/products/${handle.replace(/-/g, "")}.png`)

  const compact = handle.replace(/-/g, "")
  add(`/products/${compact}.jpg`)

  if (handle.includes("hcg") && handle.includes("5000")) {
    add("/products/hcg-5000iu.jpg")
  }
  if (handle.startsWith("glow-blend")) {
    add("/products/glow-blend-30mg.jpg")
  }

  return [...paths]
}

function resolveFromAvailableFiles(handle: string): string | null {
  for (const path of imagePathCandidates(handle)) {
    if (fileExistsAt(path)) return path
  }
  return null
}

function stripTrailingStrength(handle: string): string | null {
  const match = handle.match(/^(.+)-(\d+(?:\.\d+)?(?:mg|ml|iu|mcg|ct|count))$/i)
  return match?.[1] || null
}

function strengthToken(value: string): string | null {
  const match = value.match(/(\d+(?:\.\d+)?(?:mg|ml|iu|mcg))/i)
  return match?.[1]?.toLowerCase() || null
}

function compoundImageForHandle(handle: string): string | null {
  if (COMPOUND_IMAGES[handle]) return COMPOUND_IMAGES[handle]

  const base = stripTrailingStrength(handle)
  if (!base) return null

  if (COMPOUND_IMAGES[base]) {
    const handleStrength = strengthToken(handle)
    const imageStrength = strengthToken(COMPOUND_IMAGES[base])
    if (!handleStrength || !imageStrength || handleStrength === imageStrength) {
      return COMPOUND_IMAGES[base]
    }
  }

  if (base.startsWith("glow-blend") || base.startsWith("glow-")) {
    return "/products/glow-blend-30mg.jpg"
  }

  return null
}

function extractStrengthFromHandle(handle: string): string | null {
  const match = handle.match(/(\d+(?:\.\d+)?(?:\s*|-\s*)(?:mg|ml|iu|mcg|ct|count))$/i)
  return match?.[1]?.toLowerCase().replace(/[\s-]/g, "") || null
}

function extractStrengthFromImagePath(imagePath: string): string | null {
  const filename = imagePath.split("/").pop() || ""
  const match = filename.match(/(\d+(?:\.\d+)?(?:\s*|-\s*)?(?:mg|ml|iu|mcg|ct|count))/i)
  return match?.[1]?.toLowerCase().replace(/[\s-]/g, "") || null
}

function validateStrengthMatch(imagePath: string, productHandle: string): string | null {
  const skipPatterns = [
    "/v2/",
    "cat-",
    "blend",
    "capsule",
    "caps",
    "bac-water",
    "acetic-acid",
    "benzyl-alcohol",
    "lipo-c",
    "lemon-bottle",
    "vial-single",
    "vial-water",
    "vial-blend",
    "bottle-"
  ]

  const lowerPath = imagePath.toLowerCase()
  if (skipPatterns.some((pattern) => lowerPath.includes(pattern))) {
    return imagePath
  }

  const productStrength = extractStrengthFromHandle(productHandle)
  const imageStrength = extractStrengthFromImagePath(imagePath)

  if (!productStrength || !imageStrength) return imagePath
  if (productStrength === imageStrength) return imagePath

  if (process.env.NODE_ENV === "development") {
    console.warn(
      `[STRENGTH MISMATCH] Product "${productHandle}" (${productStrength}) ` +
        `blocked from using image "${imagePath}" (${imageStrength})`
    )
  }
  return null
}

function acceptMappedImage(image: string | null, handle: string): string | null {
  if (!image) return null
  return validateStrengthMatch(image, handle)
}

export function getProductImageForHandle(handle: string, variantHandle?: string) {
  const v2Image = getV2ProductImage(handle)
  if (v2Image) return v2Image

  const alias = handleAliases[handle]
  const aliasImage = acceptMappedImage(alias?.image ?? null, handle)
  if (aliasImage) return aliasImage

  const candidates = [handle, variantHandle].filter(Boolean) as string[]
  for (const candidate of candidates) {
    const fromFiles = acceptMappedImage(resolveFromAvailableFiles(candidate), candidate)
    if (fromFiles) return fromFiles

    const kimiImage = acceptMappedImage(kimiImages[candidate] ?? null, candidate)
    if (kimiImage) return kimiImage

    const aliasCandidate = handleAliases[candidate]
    const aliasCandidateImage = acceptMappedImage(aliasCandidate?.image ?? null, candidate)
    if (aliasCandidateImage) return aliasCandidateImage

    const compound = acceptMappedImage(compoundImageForHandle(candidate), candidate)
    if (compound) return compound
  }

  const normalizedHandle = normalizeKey(handle)
  for (const [slug, image] of Object.entries(kimiImages)) {
    if (normalizeKey(slug) === normalizedHandle) {
      const validated = acceptMappedImage(image, handle)
      if (validated) return validated
    }
  }

  return null
}

export function getProductImage(product: StoreProduct) {
  const v2Image = getV2ProductImage(product.handle)
  if (v2Image) return v2Image

  const metadataUrl = String(product.metadata?.product_image || product.metadata?.image_url || "")
  if (
    metadataUrl.startsWith("/products/v2/") ||
    (metadataUrl.startsWith("http") && metadataUrl.includes("/products/v2/"))
  ) {
    return metadataUrl
  }

  const mapped = getProductImageForHandle(product.handle)
  if (mapped && mapped.includes("/products/v2/")) return mapped

  const visual = String(product.metadata?.visual_type || "vial")
  if (visual === "capsule") {
    return visualFallback.capsule
  }

  return visualFallback[visual] || GENERIC_VIAL
}

export function getProductPurity(product: StoreProduct) {
  const purity = product.metadata?.purity_percent
  if (typeof purity === "number") return `${purity}%`
  return String(product.metadata?.purity || "99%+")
}

export function getPrimaryVariant(product: StoreProduct) {
  return product.variants?.[0]
}

export function getProductPrice(product: StoreProduct) {
  return getProductPriceCents(product) / 100
}

export { getVariantPriceCents }

export function isBlendProduct(product: StoreProduct) {
  const visual = String(product.metadata?.visual_type || "")
  return visual === "blend" || product.handle.includes("blend") || isGlowBlendProduct(product)
}

const GLOW_BLEND_HANDLES = new Set([
  "glow-blend-30mg",
  "glow-blend-85mg",
  "glow-bpc-157-tb500-ghk-cu",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg"
])

export function isGlowBlendProduct(product: StoreProduct) {
  return GLOW_BLEND_HANDLES.has(product.handle) || product.handle.startsWith("glow-blend-")
}

export function getProductDisplayName(product: StoreProduct) {
  if (isGlowBlendProduct(product)) return "Glow Blend"
  return product.title
}

export function getProductDisplaySubtitle(product: StoreProduct) {
  if (isGlowBlendProduct(product)) return "BPC-157 + TB-500 + GHK-Cu"
  return null
}

export function getProductStrengthLabel(product: StoreProduct) {
  const fromMeta = product.metadata?.strength
  if (fromMeta) return String(fromMeta)
  const match = product.handle.match(/(\d+mg)$/i)
  return match?.[1] || null
}
