/** Maps source catalog rows to the four storefront category slugs. */
export const STOREFRONT_CATEGORIES = [
  {
    id: "glp1",
    name: "GLP-1 Research",
    slug: "glp-1-research",
    description:
      "Glucagon-like peptide-1 receptor agonists for metabolic and glucose homeostasis research. Includes Semaglutide, Tirzepatide, and novel triple-agonist compounds.",
  },
  {
    id: "growth",
    name: "Growth Factors",
    slug: "growth-factors",
    description:
      "BPC-157, TB-500, GHK-Cu, growth hormone secretagogues, IGF-1, neuropeptides, and other tissue repair and cellular signaling research peptides.",
  },
  {
    id: "blends",
    name: "Research Blends",
    slug: "research-blends",
    description:
      "Pre-formulated synergistic stacks combining complementary research compounds.",
  },
  {
    id: "supplies",
    name: "Lab Supplies",
    slug: "lab-supplies",
    description:
      "Bacteriostatic water, reconstitution kits, and essential laboratory supplies.",
  },
]

const SOURCE_CATEGORY_MAP = {
  "Supplies & Reconstitution": "lab-supplies",
  "BPC-157 / TB500": "growth-factors",
  "CJC / Ipamorelin / GHRP": "growth-factors",
  "Growth Hormone Axis": "growth-factors",
  "Mitochondrial / Metabolic Other": "growth-factors",
  "Cosmetic / Copper / Tanning": "growth-factors",
  "Longevity / Thymic / Neuropeptides": "growth-factors",
  "Vitamins & Injectables": "growth-factors",
  "Legacy Catalog": "growth-factors",
  Blends: "research-blends",
}

/** Products sold as stacks — always Research Blends regardless of source sheet category. */
const BLEND_PRODUCTS = new Set([
  "BPC-157 + TB-500 Blend",
  "CU 50mg + TB500 10mg + BPC-157 10mg + KPV 10mg",
  "Glow BPC-157 + TB500 + GHK-Cu",
  "Glow TB500 10mg + BPC-157 10mg + GHK-Cu 50mg",
  "CJC-1295 without DAC / Ipamorelin Blend",
  "CJC-1295 without DAC / Sermorelin / Ipamorelin Blend",
  "Cagrilintide + Semaglutide",
])

/** GHRH/secretagogue peptides miscategorized under incretin in the pricing sheet. */
const GROWTH_FROM_GLP1 = new Set(["Sermorelin", "Tesamorelin"])

/** True incretin / metabolic GLP-1 class compounds. */
const GLP1_PRODUCTS = new Set([
  "Semaglutide",
  "Tirzepatide",
  "Retatrutide",
  "Cagrilintide",
  "Mazdutide",
  "Survodutide",
  "5-Amino-1MQ",
  "AOD-9604",
])

export function resolveStorefrontCategorySlug(name, sourceCategory) {
  if (BLEND_PRODUCTS.has(name) || [...BLEND_PRODUCTS].some((blend) => name.startsWith(`${blend} `))) {
    return "research-blends"
  }
  if (sourceCategory === "GLP-1 / Incretin") {
    if (GROWTH_FROM_GLP1.has(name)) return "growth-factors"
    if (GLP1_PRODUCTS.has(name)) return "glp-1-research"
    return "growth-factors"
  }
  return SOURCE_CATEGORY_MAP[sourceCategory] || "growth-factors"
}

export function resolveStorefrontCategoryName(name, sourceCategory) {
  const slug = resolveStorefrontCategorySlug(name, sourceCategory)
  return STOREFRONT_CATEGORIES.find((c) => c.slug === slug)?.name || "Growth Factors"
}
