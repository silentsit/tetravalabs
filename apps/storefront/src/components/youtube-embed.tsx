import Image from "next/image"
import type { BlogVideo } from "@/lib/sanity"

type Props = {
  video: BlogVideo
}

/** Outbound YouTube citation card. No in-page player: Research Hub posts are articles, not watch pages. */
export function YoutubeEmbed({ video }: Props) {
  const title = video.title || "Source video"
  const href = `https://www.youtube.com/watch?v=${video.youtubeId}`
  const poster = video.thumbnail || youtubeThumbnailUrl(video.youtubeId)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white transition-colors hover:border-[#0D9488]"
    >
      <span className="relative block w-40 shrink-0 bg-[#0F172A] sm:w-52">
        <Image
          src={poster}
          alt=""
          width={480}
          height={360}
          unoptimized
          className="h-full w-full object-cover"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-wide text-[#0D9488]">
          Watch on YouTube
        </span>
        <span className="font-medium text-[#0F172A]">{title}</span>
        {video.presenter ? (
          <span className="text-sm text-[#475569]">{video.presenter}</span>
        ) : null}
      </span>
    </a>
  )
}

export function youtubeThumbnailUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
}
