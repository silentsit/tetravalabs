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
    image: "/products/v2/semaglutide-5mg.png"
  },
  {
    slug: "growth-factors",
    name: "Growth Factors",
    description:
      "BPC-157, TB-500, GHK-Cu, growth hormone secretagogues, IGF-1, neuropeptides, and other tissue repair research peptides.",
    image: "/products/v2/bpc-157-5mg.png"
  },
  {
    slug: "research-blends",
    name: "Research Blends",
    description: "Pre-formulated synergistic stacks combining complementary compounds.",
    image: "/products/v2/glow-blend-30mg.png"
  },
  {
    slug: "lab-supplies",
    name: "Lab Supplies",
    description: "Bacteriostatic water, reconstitution kits, and laboratory supplies.",
    image: "/products/v2/bacteriostatic-water-10ml.png"
  }
]

export function categoryArtForSlug(slug: string, fallbackName: string) {
  return (
    categoryArt.find((item) => item.slug === slug) || {
      slug,
      name: fallbackName,
      description: "Browse research compounds in this category.",
      image: "/products/v2/semaglutide-5mg.png"
    }
  )
}
