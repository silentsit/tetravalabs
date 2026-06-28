import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

let client: S3Client | null = null

function getR2Config() {
  const bucket = process.env.R2_BUCKET?.trim()
  const endpoint = process.env.R2_ENDPOINT?.trim()
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim()
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim()
  const publicBaseUrl = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "")

  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
    return null
  }

  return { bucket, endpoint, accessKeyId, secretAccessKey, publicBaseUrl }
}

export function isR2Configured() {
  return Boolean(getR2Config())
}

function getClient() {
  const config = getR2Config()
  if (!config) {
    throw new Error("Cloudflare R2 is not configured")
  }

  if (!client) {
    client = new S3Client({
      region: process.env.R2_REGION || "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      }
    })
  }

  return { client, bucket: config.bucket, publicBaseUrl: config.publicBaseUrl }
}

export function buildR2PublicUrl(storageKey: string) {
  const config = getR2Config()
  if (!config?.publicBaseUrl) return null
  return `${config.publicBaseUrl}/${storageKey.replace(/^\/+/, "")}`
}

export function resolveCoaDocumentUrl(documentUrl: string, storageKey?: string | null) {
  if (storageKey) {
    const publicUrl = buildR2PublicUrl(storageKey)
    if (publicUrl) return publicUrl
  }

  if (documentUrl.startsWith("r2://")) {
    const key = documentUrl.slice("r2://".length)
    const publicUrl = buildR2PublicUrl(key)
    if (publicUrl) return publicUrl
    return documentUrl
  }

  if (documentUrl.includes("example.com")) {
    return documentUrl
  }

  return documentUrl
}

export async function uploadCoaObject(input: {
  key: string
  body: Buffer | Uint8Array | string
  contentType?: string
}) {
  const { client: s3, bucket } = getClient()
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: input.key,
      Body: input.body,
      ContentType: input.contentType || "application/pdf"
    })
  )
  return buildR2PublicUrl(input.key)
}

export async function getCoaSignedUrl(storageKey: string, expiresInSeconds = 3600) {
  const { client: s3, bucket } = getClient()
  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey
    }),
    { expiresIn: expiresInSeconds }
  )
}

export async function getCoaObject(storageKey: string) {
  const { client: s3, bucket } = getClient()
  const response = await s3.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: storageKey.replace(/^\/+/, "")
    })
  )

  const body = await response.Body?.transformToByteArray()
  if (!body?.length) {
    throw new Error("COA object is empty")
  }

  return {
    body: Buffer.from(body),
    contentType: response.ContentType || "application/pdf"
  }
}
