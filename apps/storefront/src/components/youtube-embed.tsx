import type { BlogVideo } from "@/lib/sanity"

type Props = {
  video: BlogVideo
}

/** Responsive, privacy-enhanced (youtube-nocookie) YouTube embed for video-backed research articles. */
export function YoutubeEmbed({ video }: Props) {
  const title = video.title || "Source video"
  const src = `https://www.youtube-nocookie.com/embed/${video.youtubeId}`

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl border border-[#E2E8F0] bg-black">
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}

export function youtubeThumbnailUrl(youtubeId: string) {
  return `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`
}
