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
    image: "/v2/cat-metabolic.jpg"
  },
  {
    slug: "growth-factors",
    name: "Growth Factors",
    description:
      "BPC-157, TB-500, GHK-Cu, growth hormone secretagogues, IGF-1, neuropeptides, and other tissue repair research peptides.",
    image: "/v2/cat-growth.jpg"
  },
  {
    slug: "research-blends",
    name: "Research Blends",
    description: "Pre-formulated synergistic stacks combining complementary compounds.",
    image: "/v2/cat-blends.jpg"
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description: "Bacteriostatic water, reconstitution kits, and laboratory supplies.",
    image: "/v2/cat-tissue.jpg"
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
