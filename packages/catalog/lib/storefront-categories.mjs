/** Maps source catalog rows to storefront category slugs. */
export const STOREFRONT_CATEGORIES = [
  {
    id: "glp1",
    name: "GLP-1 Research",
    slug: "glp-1-research",
    description:
      "Glucagon-like peptide-1 receptor agonists for metabolic and glucose homeostasis research. Includes Semaglutide, Tirzepatide, and novel triple-agonist compounds.",
  },
  {
    id: "tissue",
    name: "Tissue Repair",
    slug: "tissue-repair",
    description:
      "BPC-157, TB-500, GHK-Cu, KPV, and related compounds for tissue repair and recovery research.",
  },
  {
    id: "ghAxis",
    name: "Growth Hormone Axis",
    slug: "growth-hormone-axis",
    description:
      "CJC-1295, Ipamorelin, GHRP, Sermorelin, Tesamorelin, and other growth hormone secretagogue research peptides.",
  },
  {
    id: "longevity",
    name: "Longevity & Neuropeptides",
    slug: "longevity-neuropeptides",
    description:
      "Epithalon, Selank, Semax, thymic peptides, and neuropeptides used in longevity and cognitive research models.",
  },
  {
    id: "metabolic",
    name: "Metabolic & Mitochondrial",
    slug: "metabolic-mitochondrial",
    description:
      "MOTS-c, NAD+, SS-31, injectable vitamins, and other metabolic and mitochondrial research compounds.",
  },
  {
    id: "blends",
    name: "Research Blends",
    slug: "research-blends",
    description: "Pre-formulated synergistic stacks combining complementary research compounds.",
  },
  {
    id: "supplies",
    name: "Lab Supplies",
    slug: "lab-supplies",
    description: "Bacteriostatic water, reconstitution kits, and essential laboratory supplies.",
  },
]

const SOURCE_CATEGORY_MAP = {
  "Supplies & Reconstitution": "lab-supplies",
  "BPC-157 / TB500": "tissue-repair",
  "Cosmetic / Copper / Tanning": "tissue-repair",
  "CJC / Ipamorelin / GHRP": "growth-hormone-axis",
  "Growth Hormone Axis": "growth-hormone-axis",
  "Longevity / Thymic / Neuropeptides": "longevity-neuropeptides",
  "Mitochondrial / Metabolic Other": "metabolic-mitochondrial",
  "Vitamins & Injectables": "metabolic-mitochondrial",
  "Legacy Catalog": "longevity-neuropeptides",
  Blends: "research-blends",
}

/** Products sold as stacks — always Research Blends regardless of source sheet category. */
const BLEND_PRODUCTS = new Set([
  "BPC-157 + TB500 Blend",
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
    if (GROWTH_FROM_GLP1.has(name)) return "growth-hormone-axis"
    if (GLP1_PRODUCTS.has(name)) return "glp-1-research"
    return "metabolic-mitochondrial"
  }
  return SOURCE_CATEGORY_MAP[sourceCategory] || "longevity-neuropeptides"
}

export function resolveStorefrontCategoryName(name, sourceCategory) {
  const slug = resolveStorefrontCategorySlug(name, sourceCategory)
  return STOREFRONT_CATEGORIES.find((c) => c.slug === slug)?.name || "Longevity & Neuropeptides"
}
