import Image from "next/image"

const LOGO_SRC = "/brand/Tetrava-Labs-Logo-white-bg.png"
const LOGO_WIDTH = 1632
const LOGO_HEIGHT = 248

const FOOTER_LOGO_SRC = "/brand/Tetrava-labs-logo-footer-white-font.png"
const FOOTER_LOGO_WIDTH = 1654
const FOOTER_LOGO_HEIGHT = 272

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
      className={`${sizeClass} ${variantClass} ${className}`.trim()}
    />
  )
}
