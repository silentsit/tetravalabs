/** Root-relative paths served from /public — skip Vercel Image Optimization. */
export function isLocalPublicImage(src: string): boolean {
  const trimmed = src.trim()
  return trimmed.startsWith("/") && !trimmed.startsWith("//")
}

/** Spread onto next/image for pre-baked /public assets. */
export function localImageProps(src: string): { unoptimized: true } | Record<string, never> {
  return isLocalPublicImage(src) ? { unoptimized: true } : {}
}
