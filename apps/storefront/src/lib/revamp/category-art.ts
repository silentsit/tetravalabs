export type CategoryArt = {
  slug: string
  name: string
  description: string
  image: string
}

export const categoryArt: CategoryArt[] = [
  {
    slug: "glp-1-research",
    name: "GLP-1 Research",
    description:
      "Shop GLP-1 research peptides with verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).",
    image: "/v2/cat-glp-1-research.jpg"
  },
  {
    slug: "tissue-repair",
    name: "Tissue Repair",
    description:
      "Shop tissue repair research peptides including BPC-157, TB-500, and GHK-Cu. Verified 99%+ HPLC-MS purity with lot-linked COAs. RUO.",
    image: "/v2/cat-tissue-repair.jpg"
  },
  {
    slug: "growth-hormone-axis",
    name: "Growth Hormone Axis",
    description:
      "Shop growth hormone axis research peptides including CJC-1295, Ipamorelin, and Sermorelin. Lot-linked COAs and cold-chain shipping. RUO.",
    image: "/v2/cat-growth-hormone-axis.jpg"
  },
  {
    slug: "longevity-neuropeptides",
    name: "Longevity & Neuropeptides",
    description:
      "Shop longevity and neuropeptide research compounds including Epithalon, Selank, and Semax. Verified purity with lot-linked COAs. RUO.",
    image: "/v2/cat-longevity-neuropeptides.jpg"
  },
  {
    slug: "metabolic-mitochondrial",
    name: "Metabolic & Mitochondrial",
    description:
      "Shop metabolic and mitochondrial research peptides including MOTS-c, NAD+, and SS-31. HPLC-MS verified with lot-linked COAs. RUO.",
    image: "/v2/cat-metabolic-mitochondrial.jpg"
  },
  {
    slug: "research-blends",
    name: "Research Blends",
    description:
      "Shop research peptide blends with complementary compounds, verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. RUO.",
    image: "/v2/cat-research-blends.jpg"
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description:
      "Shop bacteriostatic water, reconstitution supplies, and laboratory materials for research peptide workflows. Documented lots. Research use only.",
    image: "/v2/cat-lab-supplies.jpg"
  }
]

export function categoryArtForSlug(slug: string, fallbackName: string) {
  return (
    categoryArt.find((item) => item.slug === slug) || {
      slug,
      name: fallbackName,
      description: `Shop ${fallbackName} research peptides with verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).`,
      image: "/v2/vial-single.jpg"
    }
  )
}
