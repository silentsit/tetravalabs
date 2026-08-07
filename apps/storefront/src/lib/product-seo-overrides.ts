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
    absoluteTitle: "Buy BPC-157 Peptide | BPC-157 Peptides for Sale | Tetrava Labs",
    description:
      "Buy BPC-157 peptide for sale at Tetrava Labs — third-party verified 99%+ purity with lot-linked COA. Best place to buy BPC-157.",
    imageAlt: "BPC-157 peptide for sale in vial"
  }
}

export function getProductSeoOverride(parentHandle: string): ProductSeoOverride | null {
  return PRODUCT_SEO_OVERRIDES[parentHandle] || null
}
