import Image from "next/image"

const LOGO_SRC = "/brand/tetravalabs-logo.png"
const LOGO_WIDTH = 1024
const LOGO_HEIGHT = 166

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

  return (
    <Image
      src={LOGO_SRC}
      alt="TETRAVA Labs"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={variant === "default"}
      className={`${sizeClass} ${variantClass} ${className}`.trim()}
    />
  )
}
