/**
 * Maps product handles → v2 SVG/PNG assets.
 * Regenerate mappings: npm run map:images
 *
 * Policy: labeled SVGs for shop/PDP/cart/search; photorealistic PNGs for homepage featured row only.
 */
import generatedMap from "@/lib/product-image-map.generated.json"

const V2_BASE = "/products/v2"
const GENERIC_FALLBACK = "/v2/vial-single.jpg"

/** Photorealistic PNGs (v2-photos) — homepage featured row only. */
export const FEATURED_PNG_IMAGES: Record<string, string> = {
  "bpc-157-5mg": `${V2_BASE}/bpc-157-5mg.png`,
  "semaglutide-5mg": `${V2_BASE}/semaglutide-5mg.png`,
  "tirzepatide-10mg": `${V2_BASE}/tirzepatide-10mg.png`,
  "retatrutide-5mg": `${V2_BASE}/retatrutide-5mg.png`,
  "ghk-cu-50mg": `${V2_BASE}/ghk-cu-50mg.png`,
  "ipamorelin-5mg": `${V2_BASE}/ipamorelin-5mg.png`,
  "tb500-10mg": `${V2_BASE}/tb500-10mg.png`,
  "hgh-191aa-10-iu": `${V2_BASE}/hgh-10iu.png`
}

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

/** Legacy Medusa base handles (no strength suffix) → default v2 SVG. */
const LEGACY_BASE_IMAGES: Record<string, string> = {
  "5-amino-1mq": `${V2_BASE}/5-amino-1mq-5mg.svg`,
  "acetic-acid-water": `${V2_BASE}/acetic-acid-3ml.svg`,
  "adipotide": `${V2_BASE}/adipotide-2mg.svg`,
  "aicar": `${V2_BASE}/aicar-50mg.svg`,
  "aod-9604": `${V2_BASE}/aod-9604-5mg.svg`,
  "ara-290": `${V2_BASE}/ara-290-10mg.svg`,
  "b-12": `${V2_BASE}/b-12-10mg.svg`,
  "bacteriostatic-water": `${V2_BASE}/bacteriostatic-water-10ml.svg`,
  "benzyl-alcohol": `${V2_BASE}/acetic-acid-3ml.svg`,
  "bpc-157": `${V2_BASE}/bpc-157-5mg.svg`,
  "bremelanotide": `${V2_BASE}/bremelanotide-10mg.svg`,
  "cagrilintide": `${V2_BASE}/cagrilintide-5mg.svg`,
  "cjc-1295-with-dac": `${V2_BASE}/cjc-1295-5mg.svg`,
  "cjc-1295-without-dac": `${V2_BASE}/cjc-1295-no-dac-5mg.svg`,
  "cjc-1295-without-dac-ipamorelin-blend": `${V2_BASE}/cjc-ipa-blend-10mg.svg`,
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend": `${V2_BASE}/cjc-serm-ipa-blend-5mg.svg`,
  "dermorphin": `${V2_BASE}/dermorphin-5mg.svg`,
  "dsip": `${V2_BASE}/dsip-5mg.svg`,
  "epithalon": `${V2_BASE}/epithalon-10mg.svg`,
  "foxo4-dri": `${V2_BASE}/foxo4-dri-10mg.svg`,
  "ghk-cu": `${V2_BASE}/ghk-cu-50mg.svg`,
  "ghrp-2-acetate": `${V2_BASE}/ghrp-2-5mg.svg`,
  "ghrp-6-acetate": `${V2_BASE}/ghrp-6-5mg.svg`,
  "glutathione": `${V2_BASE}/glutathione-600mg.svg`,
  "gonadorelin": `${V2_BASE}/gonadorelin-2mg.svg`,
  "hcg": `${V2_BASE}/hcg-5000iu.svg`,
  "hexarelin-acetate": `${V2_BASE}/hexarelin-2mg.svg`,
  "hgh-191aa": `${V2_BASE}/hgh-191aa-10iu.svg`,
  "hmg": `${V2_BASE}/hmg-75iu.svg`,
  "igf-1-lr3": `${V2_BASE}/igf-1-lr3-1mg.svg`,
  "ipamorelin": `${V2_BASE}/ipamorelin-5mg.svg`,
  "kisspeptin-10": `${V2_BASE}/kisspeptin-10-5mg.svg`,
  "kpv": `${V2_BASE}/kpv-5mg.svg`,
  "l-carnitine": `${V2_BASE}/l-carnitine-600mg.svg`,
  "l-glu": `${V2_BASE}/l-glu-100mg.svg`,
  "lemon-bottle": `${V2_BASE}/lemon-bottle-10ml.svg`,
  "lipo-c": `${V2_BASE}/lipo-c-10ml.svg`,
  "ll-37": `${V2_BASE}/ll-37-5mg.svg`,
  "mazdutide": `${V2_BASE}/mazdutide-5mg.svg`,
  "melanotan-1": `${V2_BASE}/melanotan-i-10mg.svg`,
  "melanotan-2": `${V2_BASE}/melanotan-ii-10mg.svg`,
  "mgf": `${V2_BASE}/mgf-2mg.svg`,
  "mk-677": `${V2_BASE}/mk-677-5mg.svg`,
  "mots-c": `${V2_BASE}/mots-c-5mg.svg`,
  "nad": `${V2_BASE}/nad-100mg.svg`,
  "oxytocin-acetate": `${V2_BASE}/oxytocin-2mg.svg`,
  "peg-mgf": `${V2_BASE}/peg-mgf-2mg.svg`,
  "retatrutide": `${V2_BASE}/retatrutide-5mg.svg`,
  "selank": `${V2_BASE}/selank-5mg.svg`,
  "semax": `${V2_BASE}/semax-5mg.svg`,
  "semaglutide": `${V2_BASE}/semaglutide-5mg.svg`,
  "sermorelin": `${V2_BASE}/sermorelin-5mg.svg`,
  "snap-8": `${V2_BASE}/snap-8-10mg.svg`,
  "ss-31": `${V2_BASE}/ss-31-10mg.svg`,
  "survodutide": `${V2_BASE}/survodutide-5mg.svg`,
  "tb500": `${V2_BASE}/tb500-5mg.svg`,
  "tesamorelin": `${V2_BASE}/tesamorelin-5mg.svg`,
  "thymalin": `${V2_BASE}/thymalin-10mg.svg`,
  "thymosin-alpha-1": `${V2_BASE}/thymosin-alpha-1-5mg.svg`,
  "tirzepatide": `${V2_BASE}/tirzepatide-5mg.svg`
}

function autoMatchImage(handle: string): string | null {
  const patterns: [RegExp, string][] = [
    [/bpc.?157.*5mg/i, `${V2_BASE}/bpc-157-5mg.svg`],
    [/bpc.?157.*10mg/i, `${V2_BASE}/bpc-157-10mg.svg`],
    [/bpc.?157.*capsule/i, `${V2_BASE}/bpc-157-capsules.svg`],
    [/tb500.*5mg/i, `${V2_BASE}/tb500-5mg.svg`],
    [/tb500.*10mg/i, `${V2_BASE}/tb500-10mg.svg`],
    [/ghk.?cu.*50/i, `${V2_BASE}/ghk-cu-50mg.svg`],
    [/ghk.?cu.*100/i, `${V2_BASE}/ghk-cu-100mg.svg`],
    [/cjc.*without.*dac.*5/i, `${V2_BASE}/cjc-1295-no-dac-5mg.svg`],
    [/cjc.*without.*dac.*10/i, `${V2_BASE}/cjc-1295-no-dac-10mg.svg`],
    [/cjc.*with.*dac.*5/i, `${V2_BASE}/cjc-1295-5mg.svg`],
    [/cjc.*with.*dac.*10/i, `${V2_BASE}/cjc-1295-10mg.svg`],
    [/ipamorelin.*5mg/i, `${V2_BASE}/ipamorelin-5mg.svg`],
    [/semaglutide.*5mg/i, `${V2_BASE}/semaglutide-5mg.svg`],
    [/tirzepatide.*10mg/i, `${V2_BASE}/tirzepatide-10mg.svg`],
    [/retatrutide.*5mg/i, `${V2_BASE}/retatrutide-5mg.svg`],
    [/hgh.*10.?iu/i, `${V2_BASE}/hgh-191aa-10iu.svg`],
    [/hgh.*12.?iu/i, `${V2_BASE}/hgh-191aa-12iu.svg`],
    [/hgh.*15.?iu/i, `${V2_BASE}/hgh-191aa-15iu.svg`],
    [/nad.*100/i, `${V2_BASE}/nad-100mg.svg`],
    [/nad.*500/i, `${V2_BASE}/nad-500mg.svg`],
    [/bacteriostatic.*10/i, `${V2_BASE}/bacteriostatic-water-10ml.svg`],
    [/acetic.*acid/i, `${V2_BASE}/acetic-acid-3ml.svg`],
    [/benzyl.*alcohol/i, `${V2_BASE}/acetic-acid-3ml.svg`],
    [/glow.*30/i, `${V2_BASE}/glow-blend-30mg.svg`],
    [/glow.*85/i, `${V2_BASE}/glow-blend-85mg.svg`],
    [/mots-c.*10/i, `${V2_BASE}/mots-c-10mg.svg`],
    [/epithalon.*20/i, `${V2_BASE}/epithalon-20mg.svg`],
    [/kisspeptin.*10.*10/i, `${V2_BASE}/kisspeptin-10mg.svg`],
    [/kisspeptin.*5/i, `${V2_BASE}/kisspeptin-5mg.svg`]
  ]

  for (const [pattern, image] of patterns) {
    if (pattern.test(handle)) return image
  }

  return null
}

/** Returns a v2 labeled SVG when available, otherwise null. */
export function getV2ProductImage(handle: string): string | null {
  const mapped = productImageMap[handle]
  if (mapped?.endsWith(".svg")) return mapped
  if (mapped && !mapped.endsWith(".png")) return mapped

  if (LEGACY_BASE_IMAGES[handle]) return LEGACY_BASE_IMAGES[handle]
  return autoMatchImage(handle)
}

/** Labeled SVG for shop, PDP, cart, and search. */
export function getProductImage(handle: string): string {
  return getV2ProductImage(handle) ?? GENERIC_FALLBACK
}

/** Photorealistic PNG for homepage featured row only. */
export function getFeaturedProductImage(handle: string): string {
  return FEATURED_PNG_IMAGES[handle] ?? getProductImage(handle)
}

export function isFeaturedProductHandle(handle: string): boolean {
  return handle in FEATURED_PNG_IMAGES
}
