/**
 * Editorial / scientific author profiles for bylines, Person schema, and content routing.
 * Source of truth until Sanity `author` documents are wired.
 */

export type AuthorId = "chen" | "editorial-team" | "rahman" | "sharma" | "park"

export type ContentAuthorRole =
  | "high-intent" // informational content + landing pages
  | "lab-technical" // lab guides, CoA / testing verification
  | "default" // news updates, category intros, fallback

export type AuthorProfile = {
  id: AuthorId
  slug: string
  name: string
  credentials?: string
  title: string
  bio: string[]
  /** Optional affiliations / highlights for Person schema or profile pages */
  highlights?: string[]
}

export const AUTHORS: Record<AuthorId, AuthorProfile> = {
  chen: {
    id: "chen",
    slug: "dr-k-chen",
    name: "Dr. K. Chen",
    credentials: "PhD",
    title: "Head of Research & Quality Assurance, Tetrava Labs",
    bio: [
      "Dr. Chen holds a Doctorate in Biomolecular Chemistry with over a decade of research experience specializing in peptide synthesis, HPLC analytical methodology, and protein folding kinetics.",
      "Prior to leading product compliance and technical editorial standards at Tetrava Labs, Dr. Chen contributed to published research in peptide mass spectrometry and structural biology.",
      "Today, Dr. Chen oversees Tetrava Labs' third-party testing protocols, certificate of analysis (CoA) verification, and scientific literature reviews."
    ]
  },
  "editorial-team": {
    id: "editorial-team",
    slug: "tetrava-labs-rd-scientific-editorial-team",
    name: "Tetrava Labs R&D & Scientific Editorial Team",
    title: "Scientific Editorial Panel, Tetrava Labs",
    bio: [
      "Content published by Tetrava Labs is authored and reviewed by an interdisciplinary panel of biochemists, analytical chemists, and lab technicians.",
      "Our team synthesizes peer-reviewed findings from PubMed, ScienceDirect, and international peptide research journals to ensure technical accuracy and rigorous quality control standards across all product documentation and testing reports."
    ]
  },
  rahman: {
    id: "rahman",
    slug: "s-a-rahman",
    name: "S. A. Rahman",
    credentials: "MSc",
    title: "Senior Chromatographer & Peptide Formulations Specialist",
    bio: [
      "With an MSc in Applied Analytical Chemistry, S. A. Rahman specializes in peptide sequence isolation, stability testing, and liquid chromatography-mass spectrometry (LC-MS).",
      "Rahman leads the content development for Tetrava Labs' educational portal, translating complex biochemical literature into accessible, research-grade insights for laboratory professionals."
    ]
  },
  sharma: {
    id: "sharma",
    slug: "dr-devraj-v-sharma",
    name: "Dr. Devraj V. Sharma",
    credentials: "BSc, MBBS, MD, FACP",
    title: "Chief Technical Contributor, Tetrava Labs",
    bio: [
      "Dr. Devraj Sharma completed his advanced clinical training in Endocrinology and Biomolecular Therapeutics at King's College London. A veteran researcher with more than 40 peer-reviewed publications in international medical literature, Dr. Sharma's work focuses on metabolic peptide analogs, hormone receptor dynamics, and amino acid chain stabilization.",
      "Dr. Sharma has held consultative and clinical trial advisory roles for major biotech and pharmaceutical organizations, including GlaxoSmithKline (GSK), Sanofi, and Eli Lilly. As a chief technical contributor for Tetrava Labs, Dr. Sharma guides the technical literature review and quality documentation process for research applications."
    ],
    highlights: [
      "Endocrinology and biomolecular therapeutics training — King's College London",
      "40+ peer-reviewed publications",
      "Advisory roles: GSK, Sanofi, Eli Lilly"
    ]
  },
  park: {
    id: "park",
    slug: "dr-min-hee-park",
    name: "Dr. Min-Hee Park",
    credentials: "BSc, MD, PhD",
    title: "Structural Biochemistry & Molecular Pharmacology Advisor, Tetrava Labs",
    bio: [
      "Dr. Min-Hee Park holds a dual MD/PhD in Structural Biochemistry and Molecular Pharmacology from Seoul National University, with post-doctoral research fellowships conducted at Imperial College London. An acknowledged expert in peptide kinetics, receptor-binding affinities, and mass spectrometry validation, Dr. Park has published 50+ research articles across international clinical journals.",
      "Dr. Park has served as a senior biochemical consultant for global pharmaceutical giants such as Roche, Merck, and AstraZeneca, specializing in peptide-based therapeutic pipelines. Dr. Park brings this rigorous analytical methodology to Tetrava Labs to ensure all research material summaries adhere to strict laboratory standards."
    ],
    highlights: [
      "Dual MD/PhD — Seoul National University",
      "Post-doctoral research — Imperial College London",
      "50+ peer-reviewed publications",
      "Advisory roles: Roche, Merck, AstraZeneca"
    ]
  }
}

/**
 * High-intent long-form rotation: 3 Sharma → 1 Park (repeat).
 * Use 1-based piece index for editorial sequencing.
 */
export const HIGH_INTENT_ROTATION = {
  sharmaEvery: 3,
  parkEvery: 1,
  cycleLength: 4
} as const

/** Primary author(s) by content role. */
export const CONTENT_AUTHOR_ROLES: Record<ContentAuthorRole, AuthorId[]> = {
  "high-intent": ["sharma", "park"],
  "lab-technical": ["chen", "rahman"],
  default: ["editorial-team"]
}

export function getAuthor(id: AuthorId): AuthorProfile {
  return AUTHORS[id]
}

export function getAuthorBySlug(slug: string): AuthorProfile | undefined {
  return Object.values(AUTHORS).find((author) => author.slug === slug)
}

export function authorsForRole(role: ContentAuthorRole): AuthorProfile[] {
  return CONTENT_AUTHOR_ROLES[role].map((id) => AUTHORS[id])
}

/**
 * Assign high-intent author by sequence (1-based).
 * Pieces 1–3 → Sharma, piece 4 → Park, then repeats.
 */
export function pickHighIntentAuthor(sequenceNumber: number): AuthorProfile {
  const n = Math.max(1, Math.floor(sequenceNumber))
  const slot = (n - 1) % HIGH_INTENT_ROTATION.cycleLength
  const id: AuthorId = slot === HIGH_INTENT_ROTATION.sharmaEvery ? "park" : "sharma"
  return AUTHORS[id]
}

export function authorDisplayName(author: AuthorProfile): string {
  if (!author.credentials) return author.name
  if (author.name.includes(author.credentials)) return author.name
  return `${author.name} (${author.credentials})`
}

export function authorBioText(author: AuthorProfile): string {
  return author.bio.join(" ")
}

export const AUTHOR_LIST = Object.values(AUTHORS)
