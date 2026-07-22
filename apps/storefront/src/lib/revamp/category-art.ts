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
      "Glucagon-like peptide-1 receptor agonists for metabolic and glucose homeostasis research.",
    image: "/v2/cat-glp-1-research.jpg"
  },
  {
    slug: "tissue-repair",
    name: "Tissue Repair",
    description: "BPC-157, TB-500, GHK-Cu, and related tissue repair research peptides.",
    image: "/v2/cat-tissue-repair.jpg"
  },
  {
    slug: "growth-hormone-axis",
    name: "Growth Hormone Axis",
    description: "CJC-1295, Ipamorelin, GHRP, Sermorelin, and growth hormone secretagogues.",
    image: "/v2/cat-growth-hormone-axis.jpg"
  },
  {
    slug: "longevity-neuropeptides",
    name: "Longevity & Neuropeptides",
    description: "Epithalon, Selank, Semax, thymic peptides, and neuropeptide research compounds.",
    image: "/v2/cat-longevity-neuropeptides.jpg"
  },
  {
    slug: "metabolic-mitochondrial",
    name: "Metabolic & Mitochondrial",
    description: "MOTS-c, NAD+, SS-31, injectables, and mitochondrial research compounds.",
    image: "/v2/cat-metabolic-mitochondrial.jpg"
  },
  {
    slug: "research-blends",
    name: "Research Blends",
    description: "Pre-formulated synergistic stacks combining complementary compounds.",
    image: "/v2/cat-research-blends.jpg"
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description: "Bacteriostatic water, reconstitution kits, and laboratory supplies.",
    image: "/v2/cat-lab-supplies.jpg"
  }
]

export function categoryArtForSlug(slug: string, fallbackName: string) {
  return (
    categoryArt.find((item) => item.slug === slug) || {
      slug,
      name: fallbackName,
      description: "Browse research compounds in this category.",
      image: "/v2/vial-single.jpg"
    }
  )
}
