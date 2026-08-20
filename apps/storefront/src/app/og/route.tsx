import { existsSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { ImageResponse } from "next/og"
import { isAllowedOgPhoto, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/og"

export const runtime = "nodejs"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://tetravalabs.com").replace(/\/$/, "")
const OG_DIR = dirname(fileURLToPath(import.meta.url))
const LORA_FONT_URL = new URL("./fonts/lora-600.ttf", import.meta.url)
const JOST_FONT_URL = new URL("./fonts/jost-500.ttf", import.meta.url)
const LOGO_URL = new URL("./assets/tetrava-og-logo.jpg", import.meta.url)

function dataUri(buffer: Buffer, mime: string) {
  return `data:${mime};base64,${buffer.toString("base64")}`
}

function mimeFromPath(path: string, fallback = "image/png") {
  const ext = path.split(".").pop()?.toLowerCase()
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
  if (ext === "webp") return "image/webp"
  if (ext === "gif") return "image/gif"
  if (ext === "png") return "image/png"
  return fallback
}

function readFirstExisting(paths: string[]): Buffer | null {
  for (const file of paths) {
    if (existsSync(file)) return readFileSync(file)
  }
  return null
}

function readBundledFile(url: URL): Buffer | null {
  try {
    return readFileSync(fileURLToPath(url))
  } catch {
    return null
  }
}

function readFont(url: URL, fileName: string): ArrayBuffer | null {
  const buffer =
    readBundledFile(url) ||
    readFirstExisting([
      join(OG_DIR, "fonts", fileName),
      join(process.cwd(), "src/app/og/fonts", fileName),
      join(process.cwd(), "apps/storefront/src/app/og/fonts", fileName)
    ])
  if (!buffer) return null
  return Uint8Array.from(buffer).buffer as ArrayBuffer
}

function readPublicAsset(path: string): Buffer | null {
  const relative = path.replace(/^\/+/, "")
  return readFirstExisting([
    join(process.cwd(), "public", relative),
    join(process.cwd(), "apps/storefront/public", relative)
  ])
}

function readLogo(): string | null {
  const bundled =
    readBundledFile(LOGO_URL) ||
    readFirstExisting([
      join(OG_DIR, "assets/tetrava-og-logo.jpg"),
      join(process.cwd(), "src/app/og/assets/tetrava-og-logo.jpg"),
      join(process.cwd(), "apps/storefront/src/app/og/assets/tetrava-og-logo.jpg"),
      join(process.cwd(), "public/brand/tetrava-og-logo.jpg"),
      join(process.cwd(), "apps/storefront/public/brand/tetrava-og-logo.jpg")
    ])
  return bundled ? dataUri(bundled, "image/jpeg") : null
}

async function loadPhoto(src?: string | null): Promise<string | null> {
  if (!isAllowedOgPhoto(src)) return null

  if (src.startsWith("/")) {
    if (!/\.(png|jpe?g)$/i.test(src.split("?")[0])) return null
    const local = readPublicAsset(src)
    if (local) return dataUri(local, mimeFromPath(src))

    try {
      const res = await fetch(`${SITE_URL}${src}`, { signal: AbortSignal.timeout(2500) })
      if (!res.ok) return null
      const buffer = Buffer.from(await res.arrayBuffer())
      if (!buffer.length || buffer.length > 2_000_000) return null
      return dataUri(buffer, mimeFromPath(src, res.headers.get("content-type")?.split(";")[0]))
    } catch {
      return null
    }
  }

  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(2500) })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    if (!buffer.length || buffer.length > 2_000_000) return null
    const mime = res.headers.get("content-type")?.split(";")[0] || mimeFromPath(src, "image/jpeg")
    return dataUri(buffer, mime)
  } catch {
    return null
  }
}

function titleSize(title: string, hasPhoto: boolean) {
  if (title.length > 64) return 38
  if (title.length > 48) return 44
  if (title.length > 32) return 52
  return hasPhoto ? 56 : 64
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = (searchParams.get("title") || "Tetrava Labs").trim() || "Tetrava Labs"
  const eyebrow = (searchParams.get("eyebrow") || "Research Use Only").trim()
  const kicker = (searchParams.get("kicker") || "Verified. Documented. Delivered.").trim()
  const photo = await loadPhoto(searchParams.get("photo"))
  const logo = readLogo()
  const lora = readFont(LORA_FONT_URL, "lora-600.ttf")
  const jost = readFont(JOST_FONT_URL, "jost-500.ttf")

  const fonts = [
    ...(lora ? [{ name: "Lora", data: lora, weight: 600 as const, style: "normal" as const }] : []),
    ...(jost ? [{ name: "Jost", data: jost, weight: 500 as const, style: "normal" as const }] : [])
  ]

  let response: ImageResponse
  try {
    response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#F8FAFC",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 14,
            height: 630,
            backgroundColor: "#0D9488"
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            padding: "36px 64px 40px 72px"
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "flex-start",
              justifyContent: "space-between"
            }}
          >
            {logo ? (
              <img src={logo} width={300} height={157} />
            ) : (
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  color: "#0F172A",
                  fontFamily: jost ? "Jost" : "sans-serif"
                }}
              >
                Tetrava Labs
              </div>
            )}
            <div
              style={{
                display: "flex",
                marginTop: 8,
                fontSize: 16,
                color: "#0D9488",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: jost ? "Jost" : "sans-serif"
              }}
            >
              {eyebrow}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: photo ? 680 : 1000
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: titleSize(title, Boolean(photo)),
                  lineHeight: 1.15,
                  color: "#0F172A",
                  fontFamily: lora ? "Lora" : "serif"
                }}
              >
                {title}
              </div>
              {kicker ? (
                <div
                  style={{
                    display: "flex",
                    marginTop: 22,
                    fontSize: 26,
                    lineHeight: 1.35,
                    color: "#475569",
                    fontFamily: jost ? "Jost" : "sans-serif"
                  }}
                >
                  {kicker}
                </div>
              ) : null}
            </div>
            {photo ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 360,
                  height: 360,
                  borderRadius: 24,
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0"
                }}
              >
                <img src={photo} width={320} height={320} />
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#0D9488",
                fontFamily: jost ? "Jost" : "sans-serif"
              }}
            >
              Verified. Documented. Delivered.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#94A3B8",
                fontFamily: jost ? "Jost" : "sans-serif"
              }}
            >
              tetravalabs.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      ...(fonts.length ? { fonts } : {})
    }
  )
  } catch {
    response = new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F8FAFC",
            color: "#0F172A",
            fontSize: 56
          }}
        >
          Tetrava Labs
        </div>
      ),
      { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT }
    )
  }

  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
  )
  return response
}
