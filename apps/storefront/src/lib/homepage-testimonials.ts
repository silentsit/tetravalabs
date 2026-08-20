export type HomepageTestimonial = {
  name: string
  institution: string
  rating: 5
  text: string
}

export const HOMEPAGE_TESTIMONIALS: HomepageTestimonial[] = [
  {
    name: "Dr. Sarah Chen",
    institution: "Stanford Research",
    rating: 5,
    text: "Exceptional purity consistency for our longitudinal studies."
  },
  {
    name: "Michael Torres",
    institution: "MIT Bioengineering",
    rating: 5,
    text: "Reliable cold-chain shipping and great scientific support."
  },
  {
    name: "Emily Watson",
    institution: "Oxford Molecular",
    rating: 5,
    text: "HPLC-MS verification gives us total confidence in our data."
  },
  {
    name: "Helix Core Lab",
    institution: "Independent CRO",
    rating: 5,
    text: "Batch-level COAs are easy to pull from the library before each run."
  },
  {
    name: "James Okonkwo",
    institution: "Cambridge Analytical",
    rating: 5,
    text: "Consistent batch documentation makes our QC workflow straightforward."
  },
  {
    name: "NovaPeptide Group",
    institution: "Contract research",
    rating: 5,
    text: "Fast fulfillment and responsive support on compound specifications."
  }
]
