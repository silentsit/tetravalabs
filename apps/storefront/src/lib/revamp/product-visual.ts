import type { StoreProduct } from "@/lib/medusa"
import { getProductPriceCents, getVariantPriceCents } from "@/lib/product-price"
import productImageMap from "@/lib/revamp/product-image-map.json"

type AliasEntry = { slug: string; image: string }

const kimiImages = productImageMap.kimi as Record<string, string>
const handleAliases = productImageMap.aliases as Record<string, AliasEntry>

const GENERIC_VIAL = "/v2/vial-single.jpg"
const GENERIC_BLEND = "/v2/cat-blends.jpg"

/** Files that exist under public/products (and v2 product shots). */
const AVAILABLE_IMAGE_FILES = new Set([
  "5amino1mq-10mg.jpg",
  "acetic-acid-3ml.png",
  "aod9604-5mg.jpg",
  "bac-water-10ml.png",
  "blend-bpc157-tb500.jpg",
  "bpc-157-capsules.png",
  "bpc157-5mg.jpg",
  "bremelanotide-10mg.jpg",
  "cagrilintide-5mg.jpg",
  "cjc1295-5mg.jpg",
  "dsip-5mg.jpg",
  "epithalon-10mg.jpg",
  "ghk-cu-100mg.jpg",
  "glutathione-600mg.jpg",
  "hcg-5000iu.jpg",
  "hgh-10iu.jpg",
  "igf1-lr3-1mg.jpg",
  "ipamorelin-5mg.jpg",
  "ll37-5mg.jpg",
  "melanotan2-10mg.jpg",
  "mk677-5mg.jpg",
  "nad-plus-500mg.jpg",
  "pinealon-capsules.png",
  "retatrutide-5mg.jpg",
  "selank-5mg.jpg",
  "semaglutide-5mg.jpg",
  "semax-5mg.jpg",
  "sermorelin-5mg.jpg",
  "tb500-10mg.jpg",
  "tesamorelin-5mg.jpg",
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
  nad: "/products/nad-plus-500mg.jpg",
  "acetic-acid-water": "/products/acetic-acid-3ml.png",
  "bacteriostatic-water": "/products/bac-water-10ml.png",
  "bpc-157-capsules": "/products/bpc-157-capsules.png",
  "pinealon-capsules": "/products/pinealon-capsules.png",
  "bpc-157-5mg-tb500-5mg": "/products/blend-bpc157-tb500.jpg",
  "cagrilintide-semaglutide": "/products/blend-bpc157-tb500.jpg",
  "glow-bpc-157-tb500-ghk-cu": "/products/blend-bpc157-tb500.jpg",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg": "/products/blend-bpc157-tb500.jpg"
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
    add("/products/blend-bpc157-tb500.jpg")
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
    return "/products/blend-bpc157-tb500.jpg"
  }

  return null
}

export function getProductImageForHandle(handle: string, variantHandle?: string) {
  const alias = handleAliases[handle]
  if (alias?.image) return alias.image

  const candidates = [handle, variantHandle].filter(Boolean) as string[]
  for (const candidate of candidates) {
    const fromFiles = resolveFromAvailableFiles(candidate)
    if (fromFiles) return fromFiles

    if (kimiImages[candidate]) return kimiImages[candidate]

    const aliasCandidate = handleAliases[candidate]
    if (aliasCandidate?.image) return aliasCandidate.image

    const compound = compoundImageForHandle(candidate)
    if (compound) return compound
  }

  const normalizedHandle = normalizeKey(handle)
  for (const [slug, image] of Object.entries(kimiImages)) {
    if (normalizeKey(slug) === normalizedHandle) return image
  }

  return null
}

export function getProductImage(product: StoreProduct) {
  const metadataUrl = String(product.metadata?.product_image || product.metadata?.image_url || "")
  if (metadataUrl.startsWith("/") || metadataUrl.startsWith("http")) {
    return metadataUrl
  }

  const mapped = getProductImageForHandle(product.handle)
  if (mapped) return mapped

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
