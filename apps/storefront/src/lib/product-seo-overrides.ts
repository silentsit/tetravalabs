export type ProductSeoOverride = {
  /** Exact document title (includes brand suffix). */
  absoluteTitle: string
  description: string
  /** Primary product image alt text. */
  imageAlt?: string
}

/** Curated SERP copy keyed by catalog parent handle (e.g. bpc-157). */
const PRODUCT_SEO_OVERRIDES: Record<string, ProductSeoOverride> = {
  "bpc-157": {
    absoluteTitle: "Buy BPC-157 Online (5mg / 10mg) | 99%+ Purity COA | Tetrava Labs",
    description:
      "Buy research-grade BPC-157 online in 5mg and 10mg vials. Verified 99%+ HPLC-MS purity with lot-linked COAs. Cold-chain shipping. Research use only (RUO).",
    imageAlt: "BPC-157 peptide for sale in vial"
  }
}

export function getProductSeoOverride(parentHandle: string): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null
}
