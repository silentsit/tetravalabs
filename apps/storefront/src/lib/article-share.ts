export type ArticleShareNetwork = "medium" | "facebook" | "linkedin" | "quora" | "x" | "instagram"

export type ArticleShareTarget = {
  id: ArticleShareNetwork
  label: string
  href: string
  /** Copy the article URL first. Used when the network has no web share endpoint. */
  copyThenOpen?: boolean
}

const INSTAGRAM_PROFILE =
  process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "https://www.instagram.com/tetravalabs"

export function buildArticleShareTargets(url: string, title: string): ArticleShareTarget[] {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return [
    {
      id: "medium",
      label: "Medium",
      href: `https://medium.com/new-story?title=${encodedTitle}`,
      copyThenOpen: true
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      id: "quora",
      label: "Quora",
      href: `https://www.quora.com/share?url=${encodedUrl}&title=${encodedTitle}`
    },
    {
      id: "x",
      label: "X",
      href: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    },
    {
      id: "instagram",
      label: "Instagram",
      href: INSTAGRAM_PROFILE,
      copyThenOpen: true
    }
  ]
}
