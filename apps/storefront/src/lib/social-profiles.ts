export type SocialProfileId =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "medium"
  | "quora"
  | "x"

export type SocialProfileLink = {
  id: SocialProfileId
  label: string
  href: string
}

/** Verified live social profiles. Env vars can override any entry per deployment. */
const DEFAULT_SOCIAL_PROFILES: Record<
  Exclude<SocialProfileId, "x" | "linkedin">,
  string
> = {
  facebook: "https://www.facebook.com/tetravalabs",
  instagram: "https://www.instagram.com/tetravalabs",
  medium: "https://medium.com/@tetravalabs",
  quora: "https://www.quora.com/profile/tetrava-labs"
}

const PROFILE_LABELS: Record<SocialProfileId, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  medium: "Medium",
  quora: "Quora",
  x: "X"
}

function profileLink(id: SocialProfileId, href: string | undefined): SocialProfileLink | null {
  const normalized = href?.trim()
  if (!normalized) return null
  return { id, label: PROFILE_LABELS[id], href: normalized }
}

export function resolveSocialProfileLinks(): SocialProfileLink[] {
  return [
    profileLink("instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL || DEFAULT_SOCIAL_PROFILES.instagram),
    profileLink("facebook", process.env.NEXT_PUBLIC_FACEBOOK_URL || DEFAULT_SOCIAL_PROFILES.facebook),
    profileLink("medium", process.env.NEXT_PUBLIC_MEDIUM_URL || DEFAULT_SOCIAL_PROFILES.medium),
    profileLink("quora", process.env.NEXT_PUBLIC_QUORA_URL || DEFAULT_SOCIAL_PROFILES.quora),
    profileLink("x", process.env.NEXT_PUBLIC_TWITTER_URL),
    profileLink("linkedin", process.env.NEXT_PUBLIC_LINKEDIN_URL)
  ].filter((link): link is SocialProfileLink => link !== null)
}

export function resolveSocialProfileUrls(): string[] {
  return resolveSocialProfileLinks().map((link) => link.href)
}
