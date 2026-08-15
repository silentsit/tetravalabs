import Image from "next/image"
import { localImageProps } from "@/lib/local-image"

const LOGO_SRC = "/brand/tetrava-logo-header.webp"
const LOGO_WIDTH = 480
const LOGO_HEIGHT = 73

const FOOTER_LOGO_SRC = "/brand/tetrava-logo-footer.webp"
const FOOTER_LOGO_WIDTH = 480
const FOOTER_LOGO_HEIGHT = 79

type SiteLogoProps = {
  variant?: "default" | "footer"
  className?: string
  /** When false, renders a smaller compact logo (icon + wordmark still in image). */
  showWordmark?: boolean
}

export function SiteLogo({
  variant = "default",
  className = "",
  showWordmark = true
}: SiteLogoProps) {
  const sizeClass = showWordmark ? "h-8 w-auto max-w-[220px]" : "h-6 w-auto max-w-[165px]"
  const variantClass = variant === "footer" ? "opacity-95" : ""
  const src = variant === "footer" ? FOOTER_LOGO_SRC : LOGO_SRC
  const width = variant === "footer" ? FOOTER_LOGO_WIDTH : LOGO_WIDTH
  const height = variant === "footer" ? FOOTER_LOGO_HEIGHT : LOGO_HEIGHT

  return (
    <Image
      src={src}
      alt="TETRAVA Labs"
      width={width}
      height={height}
      priority={variant === "default"}
      {...localImageProps(src)}
      className={`${sizeClass} ${variantClass} ${className}`.trim()}
    />
  )
}
