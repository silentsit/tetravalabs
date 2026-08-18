/**
 * Canonical storefront product paths for transactional email.
 * Keep HANDLE_TO_PUBLIC in sync with apps/storefront/src/lib/product-url-aliases.ts
 * (PRODUCT_HANDLE_TO_URL + SHARED_HANDLE_PUBLIC_URL).
 */

const HANDLE_TO_PUBLIC: Record<string, string> = {
  "5-amino-1mq": "buy-5-amino-1mq-online",
  "acetic-acid-water-3ml": "buy-acetic-acid-water-online",
  adamax: "buy-adamax-online",
  "adamax-10mg": "buy-adamax-online",
  adipotide: "buy-adipotide-online",
  "aicar-50mg": "buy-aicar-online",
  "aod-9604": "buy-aod-9604-online",
  "ara-290-10mg": "buy-ara-290-online",
  "b-12-10mg": "buy-b-12-online",
  "bacteriostatic-water": "buy-bacteriostatic-water-online",
  "benzyl-alcohol": "buy-benzyl-alcohol-online",
  "bpc-157": "buy-bpc-157-online",
  "bpc-157-tb500-blend": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-5mg-tb500-5mg-10mg": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-5mg-tb500-5mg-20mg": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-5mg-tb-500-5mg-10mg": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-10mg-tb-500-10mg-20mg": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-capsules-100-count-500mcg": "buy-bpc-157-capsules-online",
  bremelanotide: "buy-bremelanotide-online",
  cagrilintide: "buy-cagrilintide-online",
  "cagrilintide-semaglutide": "buy-cagrilintide-semaglutide-online",
  "cerebrolysin-10mg": "buy-cerebrolysin-online",
  "cjc-1295-with-dac": "cjc-1295-with-dac",
  "cjc-1295-without-dac": "cjc-1295-without-dac",
  "cjc-1295-without-dac-ipamorelin-blend-10mg": "cjc-1295-without-dac-ipamorelin-blend",
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend",
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": "klow-blend",
  "dermorphin-5mg": "buy-dermorphin-online",
  "dihexa-10mg": "buy-dihexa-online",
  dsip: "buy-dsip-online",
  epithalon: "buy-epithalon-online",
  "foxo4-dri-10mg": "buy-foxo4-dri-online",
  "ghk-cu": "buy-ghk-cu-online",
  "ghrp-2-acetate": "buy-ghrp-2-acetate-online",
  "ghrp-6-acetate": "buy-ghrp-6-acetate-online",
  "glow-bpc-157-tb500-ghk-cu": "glow-bpc-157-tb-500-ghk-cu",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg": "glow-bpc-157-tb-500-ghk-cu",
  glutathione: "buy-glutathione-online",
  gonadorelin: "buy-gonadorelin-online",
  hcg: "buy-hcg-online",
  "hexarelin-acetate": "buy-hexarelin-acetate-online",
  "hgh-191aa": "buy-hgh-191aa-online",
  "hmg-75-iu": "buy-hmg-online",
  "humanin-10mg": "buy-humanin-online",
  "igf-1-lr3": "buy-igf-1-lr3-online",
  "igf-1-lr3-0-1mg": "buy-igf-1-lr3-online",
  "igf-1-lr3-1mg": "buy-igf-1-lr3-online",
  ipamorelin: "buy-ipamorelin-online",
  "kisspeptin-10": "buy-kisspeptin-10-online",
  kpv: "buy-kpv-online",
  "l-carnitine-600mg-10ml": "buy-l-carnitine-online",
  "lemon-bottle-10ml": "buy-lemon-bottle-online",
  "l-glu-100mg": "buy-l-glu-online",
  "lipo-c-10ml": "buy-lipo-c-online",
  "ll-37-5mg": "buy-ll-37-online",
  mazdutide: "buy-mazdutide-online",
  "melanotan-1-10mg": "buy-melanotan-1-online",
  "melanotan-2-10mg": "buy-melanotan-2-online",
  "mgf-2mg": "buy-mgf-online",
  "mk-677-5mg": "buy-mk-677-online",
  "mots-c": "buy-mots-c-online",
  nad: "buy-nad-online",
  "oxytocin-acetate": "buy-oxytocin-acetate-online",
  "peg-mgf-2mg": "buy-peg-mgf-online",
  "pinealon-10mg": "buy-pinealon-online",
  "pinealon-capsules-100-count": "buy-pinealon-capsules-online",
  retatrutide: "buy-retatrutide-online",
  selank: "buy-selank-online",
  semaglutide: "buy-semaglutide-online",
  semax: "buy-semax-online",
  sermorelin: "buy-sermorelin-peptide",
  "snap-8-10mg": "buy-snap-8-online",
  "ss-31": "buy-ss-31-online",
  "survodutide-10mg": "buy-survodutide-online",
  tb500: "buy-tb-500-online",
  "tb-500": "buy-tb-500-online",
  tesamorelin: "buy-tesamorelin-online",
  "thymalin-10mg": "buy-thymalin-online",
  "thymosin-alpha-1": "buy-thymosin-alpha-1-online",
  tirzepatide: "buy-tirzepatide-online",
  "vip-10mg": "buy-vip-online"
}

const PUBLIC_SEGMENTS = new Set(Object.values(HANDLE_TO_PUBLIC))
const PARENT_HANDLES = Object.keys(HANDLE_TO_PUBLIC).sort((a, b) => b.length - a.length)

function normalizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^\/+/, "")
    .replace(/^product\//, "")
    .replace(/-\d+-pack$/i, "")
}

function publicProductSegment(raw: string): string {
  const handle = normalizeHandle(raw)
  if (!handle) return "shop"

  if (PUBLIC_SEGMENTS.has(handle)) return handle
  if (HANDLE_TO_PUBLIC[handle]) return HANDLE_TO_PUBLIC[handle]

  const parent = PARENT_HANDLES.find((key) => handle === key || handle.startsWith(`${key}-`))
  if (parent) return HANDLE_TO_PUBLIC[parent]

  return handle
}

export function storefrontOrigin(): string {
  return (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
}

/** Canonical PDP path, e.g. /buy-sermorelin-peptide */
export function storefrontProductPath(handle: string): string {
  return `/${publicProductSegment(handle)}`
}

export function storefrontProductUrl(handle: string): string {
  return `${storefrontOrigin()}${storefrontProductPath(handle)}`
}

export function storefrontProductReviewUrl(handle: string): string {
  return `${storefrontProductUrl(handle)}#reviews`
}
