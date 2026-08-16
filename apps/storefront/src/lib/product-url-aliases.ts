/**
 * Public SEO slugs ↔ Medusa/catalog parent handles.
 * Medusa handles stay unchanged; this map drives links, canonicals, and 301s.
 */

/** Public URL segment → catalog/Medusa parent handle */
export const PRODUCT_URL_TO_HANDLE: Record<string, string> = {
  "buy-5-amino-1mq-online": "5-amino-1mq",
  "buy-acetic-acid-water-online": "acetic-acid-water-3ml",
  "buy-adamax-online": "adamax-10mg",
  "buy-adipotide-online": "adipotide",
  "buy-aicar-online": "aicar-50mg",
  "buy-aod-9604-online": "aod-9604",
  "buy-ara-290-online": "ara-290-10mg",
  "buy-b-12-online": "b-12-10mg",
  "buy-bacteriostatic-water-online": "bacteriostatic-water",
  "buy-benzyl-alcohol-online": "benzyl-alcohol",
  "buy-bpc-157-online": "bpc-157",
  "wolverine-bpc-157-tb-500-blend": "bpc-157-tb500-blend",
  "buy-bpc-157-capsules-online": "bpc-157-capsules-100-count-500mcg",
  "buy-bremelanotide-online": "bremelanotide",
  "buy-cagrilintide-online": "cagrilintide",
  "buy-cagrilintide-semaglutide-online": "cagrilintide-semaglutide",
  "buy-cerebrolysin-online": "cerebrolysin-10mg",
  "cjc-1295-with-dac": "cjc-1295-with-dac",
  "cjc-1295-without-dac": "cjc-1295-without-dac",
  "cjc-1295-without-dac-ipamorelin-blend": "cjc-1295-without-dac-ipamorelin-blend-10mg",
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg",
  "klow-bpc-157-tb-500-ghk-cu-kpv": "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg",
  "buy-dermorphin-online": "dermorphin-5mg",
  "buy-dihexa-online": "dihexa-10mg",
  "buy-dsip-online": "dsip",
  "buy-epithalon-online": "epithalon",
  "buy-foxo4-dri-online": "foxo4-dri-10mg",
  "buy-ghk-cu-online": "ghk-cu",
  "buy-ghrp-2-acetate-online": "ghrp-2-acetate",
  "buy-ghrp-6-acetate-online": "ghrp-6-acetate",
  "glow-bpc-157-tb-500-ghk-cu": "glow-bpc-157-tb500-ghk-cu",
  "buy-glutathione-online": "glutathione",
  "buy-gonadorelin-online": "gonadorelin",
  "buy-hcg-online": "hcg",
  "buy-hexarelin-acetate-online": "hexarelin-acetate",
  "buy-hgh-191aa-online": "hgh-191aa",
  "buy-hmg-online": "hmg-75-iu",
  "buy-humanin-online": "humanin-10mg",
  "buy-igf-1-lr3-online": "igf-1-lr3",
  "buy-ipamorelin-online": "ipamorelin",
  "buy-kisspeptin-10-online": "kisspeptin-10",
  "buy-kpv-online": "kpv",
  "buy-l-carnitine-online": "l-carnitine-600mg-10ml",
  "buy-lemon-bottle-online": "lemon-bottle-10ml",
  "buy-l-glu-online": "l-glu-100mg",
  "buy-lipo-c-online": "lipo-c-10ml",
  "buy-ll-37-online": "ll-37-5mg",
  "buy-mazdutide-online": "mazdutide",
  "buy-melanotan-1-online": "melanotan-1-10mg",
  "buy-melanotan-2-online": "melanotan-2-10mg",
  "buy-mgf-online": "mgf-2mg",
  "buy-mk-677-online": "mk-677-5mg",
  "buy-mots-c-online": "mots-c",
  "buy-nad-online": "nad",
  "buy-oxytocin-acetate-online": "oxytocin-acetate",
  "buy-peg-mgf-online": "peg-mgf-2mg",
  "buy-pinealon-online": "pinealon-10mg",
  "buy-pinealon-capsules-online": "pinealon-capsules-100-count",
  "buy-retatrutide-online": "retatrutide",
  "buy-selank-online": "selank",
  "buy-semaglutide-online": "semaglutide",
  "buy-semax-online": "semax",
  "buy-sermorelin-peptide": "sermorelin",
  "buy-snap-8-online": "snap-8-10mg",
  "buy-ss-31-online": "ss-31",
  "buy-survodutide-online": "survodutide-10mg",
  "buy-tb-500-online": "tb500",
  "buy-tesamorelin-online": "tesamorelin",
  "buy-thymalin-online": "thymalin-10mg",
  "buy-thymosin-alpha-1-online": "thymosin-alpha-1",
  "buy-tirzepatide-online": "tirzepatide",
  "buy-vip-online": "vip-10mg"
}

/** Catalog/Medusa parent handle → canonical public URL segment */
export const PRODUCT_HANDLE_TO_URL: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_URL_TO_HANDLE).map(([urlSegment, catalogHandle]) => [
    catalogHandle,
    urlSegment
  ])
)

/**
 * Extra catalog handles that share a public slug (merged siblings / long Medusa SKUs).
 * Values are canonical public segments from PRODUCT_HANDLE_TO_URL.
 */
const SHARED_HANDLE_PUBLIC_URL: Record<string, string> = {
  "bpc-157-5mg-tb500-5mg-10mg": "wolverine-bpc-157-tb-500-blend",
  "bpc-157-5mg-tb500-5mg-20mg": "wolverine-bpc-157-tb-500-blend",
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg": "glow-bpc-157-tb-500-ghk-cu",
  "igf-1-lr3-0-1mg": "buy-igf-1-lr3-online",
  "igf-1-lr3-1mg": "buy-igf-1-lr3-online",
  "cjc-1295-without-dac-ipamorelin-blend-10mg": "cjc-1295-without-dac-ipamorelin-blend",
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg":
    "cjc-1295-without-dac-sermorelin-ipamorelin-blend",
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": "klow-bpc-157-tb-500-ghk-cu-kpv"
}

for (const [handle, urlSegment] of Object.entries(SHARED_HANDLE_PUBLIC_URL)) {
  PRODUCT_HANDLE_TO_URL[handle] = urlSegment
}

/** Retired pretty slugs. Requesting these URLs 404s; links use the new segment. */
export const LEGACY_PRETTY_URL_REDIRECTS: Record<string, string> = {
  "bpc-157-capsules": "buy-bpc-157-capsules-online",
  "pinealon-capsules": "buy-pinealon-capsules-online",
  "buy-sermorelin-online": "buy-sermorelin-peptide"
}

/** Resolve any known public/legacy segment to a catalog handle when possible. */
export function catalogHandleFromPublicSegment(segment: string): string | null {
  if (PRODUCT_URL_TO_HANDLE[segment]) return PRODUCT_URL_TO_HANDLE[segment]
  const next = LEGACY_PRETTY_URL_REDIRECTS[segment]
  if (next && PRODUCT_URL_TO_HANDLE[next]) return PRODUCT_URL_TO_HANDLE[next]
  return null
}
