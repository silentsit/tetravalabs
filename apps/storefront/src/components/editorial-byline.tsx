import Image from "next/image"
import Link from "next/link"
import { getAuthor } from "@/lib/authors"
import { localImageProps } from "@/lib/local-image"

type Props = {
  publishedAt?: string | null
  updatedAt?: string | null
}

function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

/** Visible Research Hub byline — Tetrava Labs Editorial Team only (no invented reviewers). */
export function EditorialByline({ publishedAt, updatedAt }: Props) {
  const author = getAuthor("editorial-team")
  const published = formatDate(publishedAt)
  const updated = formatDate(updatedAt)
  const showUpdated = Boolean(updated && updated !== published)
  const aboutHref = author.url || "/about"
  const photo = author.image || "/authors/tetrava-editorial-team.jpg"

  return (
    <div className="flex gap-4 rounded-xl border border-[#E2E8F0] bg-white p-4">
      <Link href={aboutHref} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F8FAFC]">
        <Image
          src={photo}
          alt={author.name}
          fill
          sizes="56px"
          {...localImageProps(photo)}
          className="object-cover"
        />
      </Link>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#0F172A]">
          <Link href={aboutHref} className="hover:text-[#0D9488]">
            {author.name}
          </Link>
        </p>
        <p className="mt-0.5 text-xs text-[#64748B]">{author.title}</p>
        <p className="mt-2 text-xs leading-relaxed text-[#475569]">
          {author.bio[0]} Claims cite primary literature. Research use only.
        </p>
        <p className="mt-2 text-xs text-[#94A3B8]">
          {published ? <time dateTime={publishedAt || undefined}>Published {published}</time> : null}
          {published && showUpdated ? " · " : null}
          {showUpdated ? <time dateTime={updatedAt || undefined}>Updated {updated}</time> : null}
        </p>
      </div>
    </div>
  )
}
