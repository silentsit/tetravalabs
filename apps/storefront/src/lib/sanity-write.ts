import { createClient, type SanityClient } from "@sanity/client"

let writeClient: SanityClient | null = null

export function getSanityWriteConfig() {
  const projectId = process.env.SANITY_PROJECT_ID?.trim()
  const dataset = process.env.SANITY_DATASET?.trim() || "production"
  const apiVersion = process.env.SANITY_API_VERSION?.trim() || "2025-01-01"
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim()
  return { projectId, dataset, apiVersion, token }
}

export function getSanityWriteClient(): SanityClient {
  const { projectId, dataset, apiVersion, token } = getSanityWriteConfig()
  if (!projectId || !token) {
    throw new Error("Missing SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN")
  }
  if (!writeClient) {
    writeClient = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false
    })
  }
  return writeClient
}

export async function uploadImageFromUrl(url: string, filenameHint?: string) {
  const client = getSanityWriteClient()
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Cover image fetch failed (${response.status})`)
  }
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get("content-type") || "image/jpeg"
  const ext =
    contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
        ? "webp"
        : contentType.includes("gif")
          ? "gif"
          : "jpg"
  const filename =
    filenameHint?.replace(/[^a-z0-9._-]+/gi, "-").slice(0, 80) || `semantic-pen-cover.${ext}`

  const asset = await client.assets.upload("image", buffer, {
    filename: filename.includes(".") ? filename : `${filename}.${ext}`,
    contentType
  })

  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id }
  }
}
