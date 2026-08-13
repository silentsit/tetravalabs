/**
 * Editorial / scientific author profiles for bylines, Person schema, and content routing.
 * Source of truth until Sanity `author` documents are wired.
 */

export type AuthorId = "editorial-team"

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
  /** Public path to a headshot/photo for bylines and profile cards. */
  image?: string
}

export const AUTHORS: Record<AuthorId, AuthorProfile> = {
  "editorial-team": {
    id: "editorial-team",
    slug: "tetrava-labs-editorial-team",
    name: "Tetrava Labs Editorial Team",
    title: "Editorial Team, Tetrava Labs",
    bio: [
      "Content published by Tetrava Labs is authored and reviewed by an interdisciplinary panel of biochemists, analytical chemists, and lab technicians.",
      "Our team synthesizes peer-reviewed findings from PubMed, ScienceDirect, and international peptide research journals to ensure technical accuracy and rigorous quality control standards across all product documentation and testing reports."
    ],
    image: "/authors/tetrava-editorial-team.jpg"
  }
}

/** Primary author(s) by content role. */
export const CONTENT_AUTHOR_ROLES: Record<ContentAuthorRole, AuthorId[]> = {
  "high-intent": ["editorial-team"],
  "lab-technical": ["editorial-team"],
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

export function authorDisplayName(author: AuthorProfile): string {
  if (!author.credentials) return author.name
  if (author.name.includes(author.credentials)) return author.name
  return `${author.name} (${author.credentials})`
}

export function authorBioText(author: AuthorProfile): string {
  return author.bio.join(" ")
}

export const AUTHOR_LIST = Object.values(AUTHORS)
