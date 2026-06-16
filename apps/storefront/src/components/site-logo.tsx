import Image from "next/image"

const LOGO_SRC = "/brand/tetravalabs-logo.png"
const LOGO_WIDTH = 1454
const LOGO_HEIGHT = 215

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
  const heightClass = showWordmark ? "h-8" : "h-6"
  const variantClass =
    variant === "footer" ? "brightness-0 invert opacity-90" : ""

  return (
    <Image
      src={LOGO_SRC}
      alt="TETRAVA Labs"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={variant === "default"}
      className={`w-auto ${heightClass} ${variantClass} ${className}`.trim()}
    />
  )
}
