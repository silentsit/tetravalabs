import { resolveCatalogParentHandle } from "@/lib/catalog-filter"
import { resolveProductCategorySlug } from "@/lib/categories"
import { getProductHref } from "@/lib/compound-product"
import type { StoreProduct } from "@/lib/medusa"
import { FEATURED_PRODUCT_HANDLES } from "@/lib/product-image-map"
import type { StorefrontCategorySlug } from "@/lib/category-url"

const RELATED_LIMIT = 3

/**
 * Curated similar / complementary catalog parents for PDP "You may also like".
 * Two in-class reagents plus one adjacent compound, blend, or lab supply.
 * Sibling SKUs that share a public URL get the same three handles.
 */
const RELATED_BY_HANDLE: Record<string, readonly string[]> = {
  "bpc-157": ["tb500", "ghk-cu", "bpc-157-5mg-tb500-5mg-10mg"],
  tb500: ["bpc-157", "ghk-cu", "glow-bpc-157-tb500-ghk-cu"],
  "ghk-cu": ["bpc-157", "kpv", "glow-bpc-157-tb500-ghk-cu"],
  "bpc-157-capsules-100-count-500mcg": ["bpc-157", "tb500", "kpv"],
  "melanotan-1-10mg": ["melanotan-2-10mg", "bremelanotide", "ghk-cu"],
  "melanotan-2-10mg": ["melanotan-1-10mg", "bremelanotide", "snap-8-10mg"],
  "snap-8-10mg": ["ghk-cu", "glow-bpc-157-tb500-ghk-cu", "melanotan-1-10mg"],

  semaglutide: ["tirzepatide", "retatrutide", "cagrilintide"],
  tirzepatide: ["retatrutide", "semaglutide", "mazdutide"],
  retatrutide: ["tirzepatide", "semaglutide", "survodutide-10mg"],
  cagrilintide: ["semaglutide", "cagrilintide-semaglutide", "tirzepatide"],
  "cagrilintide-semaglutide": ["semaglutide", "cagrilintide", "tirzepatide"],
  mazdutide: ["tirzepatide", "retatrutide", "survodutide-10mg"],
  "survodutide-10mg": ["retatrutide", "mazdutide", "semaglutide"],
  "aod-9604": ["semaglutide", "5-amino-1mq", "tesamorelin"],

  ipamorelin: ["cjc-1295-without-dac", "cjc-1295-without-dac-ipamorelin-blend-10mg", "sermorelin"],
  "cjc-1295-without-dac": ["ipamorelin", "cjc-1295-with-dac", "cjc-1295-without-dac-ipamorelin-blend-10mg"],
  "cjc-1295-with-dac": ["cjc-1295-without-dac", "ipamorelin", "tesamorelin"],
  sermorelin: ["ipamorelin", "tesamorelin", "cjc-1295-without-dac"],
  tesamorelin: ["sermorelin", "ipamorelin", "hgh-191aa"],
  "ghrp-2-acetate": ["ghrp-6-acetate", "ipamorelin", "hexarelin-acetate"],
  "ghrp-6-acetate": ["ghrp-2-acetate", "ipamorelin", "hexarelin-acetate"],
  "hexarelin-acetate": ["ipamorelin", "ghrp-2-acetate", "cjc-1295-without-dac"],
  "hgh-191aa": ["igf-1-lr3-1mg", "sermorelin", "tesamorelin"],
  "igf-1-lr3-0-1mg": ["hgh-191aa", "mgf-2mg", "peg-mgf-2mg"],
  "igf-1-lr3-1mg": ["hgh-191aa", "mgf-2mg", "peg-mgf-2mg"],
  "mgf-2mg": ["peg-mgf-2mg", "igf-1-lr3-1mg", "hgh-191aa"],
  "peg-mgf-2mg": ["mgf-2mg", "igf-1-lr3-1mg", "hgh-191aa"],
  gonadorelin: ["kisspeptin-10", "hcg", "hmg-75-iu"],
  hcg: ["hmg-75-iu", "gonadorelin", "kisspeptin-10"],
  "hmg-75-iu": ["hcg", "gonadorelin", "kisspeptin-10"],
  "cjc-1295-without-dac-ipamorelin-blend-10mg": [
    "cjc-1295-without-dac",
    "ipamorelin",
    "sermorelin"
  ],
  "cjc-1295-without-dac-sermorelin-ipamorelin-blend-5mg": [
    "sermorelin",
    "ipamorelin",
    "cjc-1295-without-dac-ipamorelin-blend-10mg"
  ],

  "mots-c": ["nad", "ss-31", "humanin-10mg"],
  nad: ["mots-c", "glutathione", "ss-31"],
  "ss-31": ["mots-c", "nad", "humanin-10mg"],
  glutathione: ["nad", "mots-c", "ss-31"],
  "5-amino-1mq": ["aod-9604", "semaglutide", "mots-c"],
  adipotide: ["aod-9604", "5-amino-1mq", "semaglutide"],
  "aicar-50mg": ["mots-c", "ss-31", "5-amino-1mq"],
  "mk-677-5mg": ["ipamorelin", "cjc-1295-without-dac", "igf-1-lr3-1mg"],
  "b-12-10mg": ["glutathione", "nad", "l-carnitine-600mg-10ml"],
  "l-carnitine-600mg-10ml": ["lipo-c-10ml", "5-amino-1mq", "mots-c"],
  "lemon-bottle-10ml": ["lipo-c-10ml", "l-carnitine-600mg-10ml", "aod-9604"],
  "lipo-c-10ml": ["l-carnitine-600mg-10ml", "lemon-bottle-10ml", "glutathione"],

  semax: ["semax-nasal-spray-10mg", "selank", "adamax-10mg"],
  "semax-nasal-spray-10mg": ["semax", "selank-nasal-spray-10mg", "adamax-10mg"],
  selank: ["selank-nasal-spray-10mg", "semax-nasal-spray-10mg", "semax"],
  "selank-nasal-spray-10mg": ["selank", "semax-nasal-spray-10mg", "semax"],
  "adamax-10mg": ["semax", "dihexa-10mg", "selank"],
  "dihexa-10mg": ["semax", "adamax-10mg", "cerebrolysin-10mg"],
  "cerebrolysin-10mg": ["semax", "dihexa-10mg", "pinealon-10mg"],
  dsip: ["selank", "epithalon", "pinealon-10mg"],
  epithalon: ["foxo4-dri-10mg", "thymalin-10mg", "dsip"],
  "foxo4-dri-10mg": ["epithalon", "nad", "mots-c"],
  "pinealon-10mg": ["epithalon", "pinealon-capsules-100-count", "cerebrolysin-10mg"],
  "pinealon-capsules-100-count": ["pinealon-10mg", "epithalon", "semax"],
  "thymosin-alpha-1": ["thymalin-10mg", "ll-37-5mg", "kpv"],
  "thymalin-10mg": ["thymosin-alpha-1", "epithalon", "ll-37-5mg"],
  kpv: ["ghk-cu", "bpc-157", "ll-37-5mg"],
  "ll-37-5mg": ["kpv", "thymosin-alpha-1", "ghk-cu"],
  "kisspeptin-10": ["gonadorelin", "hcg", "oxytocin-acetate"],
  "oxytocin-acetate": ["kisspeptin-10", "bremelanotide", "gonadorelin"],
  bremelanotide: ["melanotan-2-10mg", "oxytocin-acetate", "kisspeptin-10"],
  "ara-290-10mg": ["ll-37-5mg", "kpv", "thymosin-alpha-1"],
  "dermorphin-5mg": ["dsip", "selank", "vip-10mg"],
  "vip-10mg": ["dsip", "selank", "oxytocin-acetate"],
  "humanin-10mg": ["mots-c", "ss-31", "nad"],
  "l-glu-100mg": ["glutathione", "nad", "semax"],

  "bacteriostatic-water": ["acetic-acid-water-3ml", "bpc-157", "semaglutide"],
  "acetic-acid-water-3ml": ["bacteriostatic-water", "semaglutide", "tirzepatide"],
  "benzyl-alcohol": ["bacteriostatic-water", "acetic-acid-water-3ml", "bpc-157"],

  "bpc-157-tb500-blend": ["bpc-157", "tb500", "glow-bpc-157-tb500-ghk-cu"],
  "bpc-157-5mg-tb500-5mg-10mg": ["bpc-157", "tb500", "glow-bpc-157-tb500-ghk-cu"],
  "bpc-157-5mg-tb500-5mg-20mg": ["bpc-157", "tb500", "glow-bpc-157-tb500-ghk-cu"],
  "glow-bpc-157-tb500-ghk-cu": ["bpc-157", "ghk-cu", "tb500"],
  "glow-tb500-10mg-bpc-157-10mg-ghk-cu-50mg-70mg": ["bpc-157", "ghk-cu", "tb500"],
  "cu-50mg-tb500-10mg-bpc-157-10mg-kpv-10mg-80mg": ["ghk-cu", "kpv", "glow-bpc-157-tb500-ghk-cu"]
}

const ADJACENT_CATEGORY: Record<StorefrontCategorySlug, StorefrontCategorySlug> = {
  "glp-1-research": "metabolic-mitochondrial",
  "tissue-repair": "research-blends",
  "growth-hormone-axis": "research-blends",
  "longevity-neuropeptides": "metabolic-mitochondrial",
  "metabolic-mitochondrial": "glp-1-research",
  "research-blends": "tissue-repair",
  "lab-supplies": "tissue-repair"
}

function rotate<T>(items: T[], seed: string): T[] {
  if (items.length <= 1) return items
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  const offset = hash % items.length
  return [...items.slice(offset), ...items.slice(0, offset)]
}

function parentHandleOf(handle: string): string {
  return resolveCatalogParentHandle(handle) || handle
}

function lookupProduct(products: StoreProduct[], handle: string): StoreProduct | undefined {
  const wanted = parentHandleOf(handle).toLowerCase()
  const wantedHref = getProductHref(handle)
  return (
    products.find((product) => product.handle.toLowerCase() === wanted) ||
    products.find((product) => product.handle.toLowerCase() === handle.toLowerCase()) ||
    products.find((product) => getProductHref(product.handle) === wantedHref)
  )
}

function curatedHandlesFor(parentHandle: string): readonly string[] {
  return (
    RELATED_BY_HANDLE[parentHandle] ||
    RELATED_BY_HANDLE[parentHandleOf(parentHandle)] ||
    []
  )
}

/** Three similar or complementary catalog products for a PDP parent handle. */
export function selectRelatedProducts(
  parentHandle: string,
  products: StoreProduct[],
  limit = RELATED_LIMIT
): StoreProduct[] {
  const currentHref = getProductHref(parentHandle)
  const selected: StoreProduct[] = []
  const seenHrefs = new Set([currentHref])

  const tryAdd = (handle: string) => {
    if (selected.length >= limit) return
    const product = lookupProduct(products, handle)
    if (!product) return
    const href = getProductHref(product.handle)
    if (seenHrefs.has(href)) return
    seenHrefs.add(href)
    selected.push(product)
  }

  for (const handle of curatedHandlesFor(parentHandle)) {
    tryAdd(handle)
  }

  const currentProduct =
    lookupProduct(products, parentHandle) ||
    products.find((product) => getProductHref(product.handle) === currentHref)
  const categorySlug = currentProduct ? resolveProductCategorySlug(currentProduct) : null
  const sameCategory = currentProduct
    ? rotate(
        products.filter((product) => resolveProductCategorySlug(product) === categorySlug),
        parentHandle
      )
    : []
  const adjacentSlug = categorySlug ? ADJACENT_CATEGORY[categorySlug] : null
  const adjacent = adjacentSlug
    ? rotate(
        products.filter((product) => resolveProductCategorySlug(product) === adjacentSlug),
        parentHandle
      )
    : []

  for (const product of sameCategory) {
    tryAdd(product.handle)
  }
  for (const product of adjacent) {
    tryAdd(product.handle)
  }
  for (const handle of FEATURED_PRODUCT_HANDLES) {
    tryAdd(handle)
  }
  for (const product of products) {
    tryAdd(product.handle)
  }

  return selected.slice(0, limit)
}
