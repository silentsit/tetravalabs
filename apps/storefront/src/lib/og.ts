export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = "image/png"
export const OG_IMAGE_PATH = "/og"

const LOCAL_PHOTO_PREFIXES = ["/products/", "/v2/", "/images/", "/brand/"]
const REMOTE_PHOTO_PREFIXES = ["https://i.ytimg.com/vi/", "https://cdn.sanity.io/"]
const TINY_BRAND_ICON = "/brand/tetravalabs-icon.png"
const SATORI_SAFE_PHOTO = /\.(png|jpe?g)(\?|#|$)/i

function clampOgText(text: string, max: number) {
  const normalized = text.replace(/\s+/g, " ").trim()
  if (normalized.length <= max) return normalized
  const slice = normalized.slice(0, max)
  const lastSpace = slice.lastIndexOf(" ")
  return (lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : slice).trim()
}

export function isAllowedOgPhoto(src?: string | null): src is string {
  if (!src) return false
  const value = src.trim()
  if (!value || value === TINY_BRAND_ICON) return false
  if (value.includes("..") || value.includes("\\") || value.includes("\0")) return false
  if (LOCAL_PHOTO_PREFIXES.some((prefix) => value.startsWith(prefix))) {
    return value.startsWith("/") && !value.startsWith("//") && SATORI_SAFE_PHOTO.test(value)
  }
  if (!SATORI_SAFE_PHOTO.test(value) && !/[?&]fm=(png|jpe?g)\b/i.test(value)) return false
  return REMOTE_PHOTO_PREFIXES.some((prefix) => value.startsWith(prefix))
}

export function buildOgImagePath(input: {
  title: string
  eyebrow?: string
  kicker?: string
  photo?: string
}) {
  const params = new URLSearchParams()
  params.set("title", clampOgText(input.title, 90))
  if (input.eyebrow) params.set("eyebrow", clampOgText(input.eyebrow, 40))
  if (input.kicker) params.set("kicker", clampOgText(input.kicker, 80))
  if (isAllowedOgPhoto(input.photo)) params.set("photo", input.photo.trim())
  return `${OG_IMAGE_PATH}?${params.toString()}`
}
