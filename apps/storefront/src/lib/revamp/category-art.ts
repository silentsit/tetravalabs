import { CATEGORY_DISPLAY_NAME_BY_SLUG } from "@/lib/category-labels"

export type CategoryArt = {
  slug: string
  name: string
  description: string
  image: string
}

export const categoryArt: CategoryArt[] = [
  {
    slug: "glp-1-research",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["glp-1-research"],
    description:
      "Shop GLP-1 research peptides used in weight-loss and metabolic study models. Verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).",
    image: "/v2/cat-glp-1-research.jpg"
  },
  {
    slug: "tissue-repair",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["tissue-repair"],
    description:
      "Shop tissue repair research peptides including BPC-157, TB-500, and GHK-Cu for healing and recovery models. Verified 99%+ HPLC-MS purity with lot-linked COAs. RUO.",
    image: "/v2/cat-tissue-repair.jpg"
  },
  {
    slug: "growth-hormone-axis",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["growth-hormone-axis"],
    description:
      "Shop growth hormone secretagogue research peptides including CJC-1295, Ipamorelin, and Sermorelin. Lot-linked COAs and cold-chain shipping. RUO.",
    image: "/v2/cat-growth-hormone-axis.jpg"
  },
  {
    slug: "longevity-neuropeptides",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["longevity-neuropeptides"],
    description:
      "Shop longevity, cognitive, and sleep-research peptides including Epithalon, Selank, and Semax. Verified purity with lot-linked COAs. RUO.",
    image: "/v2/cat-longevity-neuropeptides.jpg"
  },
  {
    slug: "metabolic-mitochondrial",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["metabolic-mitochondrial"],
    description:
      "Shop metabolic and mitochondrial research peptides including MOTS-c, NAD+, and SS-31 for metabolic study models. HPLC-MS verified with lot-linked COAs. RUO.",
    image: "/v2/cat-metabolic-mitochondrial.jpg"
  },
  {
    slug: "research-blends",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["research-blends"],
    description:
      "Shop research peptide blends with complementary compounds, verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. RUO.",
    image: "/v2/cat-research-blends.jpg"
  },
  {
    slug: "lab-supplies",
    name: CATEGORY_DISPLAY_NAME_BY_SLUG["lab-supplies"],
    description:
      "Shop lab supplies including bacteriostatic water, reconstitution materials, and laboratory reagents for research peptide workflows. Documented lots. Research use only.",
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
