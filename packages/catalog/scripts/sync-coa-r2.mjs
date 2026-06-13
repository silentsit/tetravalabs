/**
 * Sync COA/HPLC files (PDF or image) to Cloudflare R2 and upsert lab_batch_documents rows.
 *
 * Manifest: packages/catalog/data/coa/manifest.json
 * Local files: packages/catalog/data/coa/files/<local_file>
 * Supported: .pdf, .jpg, .jpeg, .png, .webp, .gif
 *
 * Usage:
 *   npm run coa:sync-r2
 *   npm run coa:sync-r2 -- --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import pg from "pg"

const { Client: PgClient } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
dotenv.config({ path: path.join(workspaceRoot, "apps", "medusa", ".env") })

const manifestPath = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "manifest.json")
const filesDir = path.join(workspaceRoot, "packages", "catalog", "data", "coa", "files")
const dryRun = process.argv.includes("--dry-run")

const medusaUrl = (process.env.MEDUSA_ADMIN_URL || process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(
  /\/$/,
  ""
)
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

const CONTENT_TYPES = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif"
}

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

function buildPublicUrl(storageKey, publicBaseUrl) {
  if (!publicBaseUrl) return `r2://${storageKey}`
  return `${publicBaseUrl}/${storageKey.replace(/^\/+/, "")}`
}

function normalizeExtension(value) {
  if (!value) return ".pdf"
  const ext = value.startsWith(".") ? value.toLowerCase() : `.${value.toLowerCase()}`
  return CONTENT_TYPES[ext] ? ext : ".pdf"
}

function extensionFromFilename(filename) {
  return normalizeExtension(path.extname(filename))
}

function contentTypeForExtension(ext) {
  return CONTENT_TYPES[normalizeExtension(ext)] || "application/octet-stream"
}

function minimalPdfBuffer(title) {
  const text = `%PDF-1.4\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>endobj\n4 0 obj<< /Length 44 >>stream\nBT /F1 12 Tf 72 720 Td (${title}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000214 00000 n \ntrailer<< /Size 5 /Root 1 0 R >>\nstartxref\n304\n%%EOF\n`
  return Buffer.from(text, "utf8")
}

async function loadDocumentBody(entry) {
  const label = `${entry.batch_number} ${entry.document_type}`

  if (entry.local_file) {
    const filePath = path.join(filesDir, entry.local_file)
    try {
      const body = await fs.readFile(filePath)
      const ext = extensionFromFilename(entry.local_file)
      return { body, ext, contentType: contentTypeForExtension(ext), source: entry.local_file }
    } catch {
      console.warn(`[warn] ${entry.id}: missing file ${entry.local_file}, uploading placeholder PDF`)
    }
  }

  const ext = normalizeExtension(entry.file_extension)
  if (ext !== ".pdf") {
    console.warn(`[warn] ${entry.id}: no local_file for ${ext}; uploading placeholder PDF instead`)
  }

  return {
    body: minimalPdfBuffer(label),
    ext: ".pdf",
    contentType: "application/pdf",
    source: "placeholder"
  }
}

function buildStorageKey(entry, variantId, ext) {
  if (entry.storage_key) {
    return entry.storage_key.replace(/\.(pdf|jpe?g|png|webp|gif)$/i, ext)
  }
  return `coa/${variantId}/${entry.batch_number}/${entry.document_type}${ext}`
}

async function fetchProducts() {
  const response = await fetch(`${medusaUrl}/store/products?limit=100`, {
    headers: {
      ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {})
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to load products from Medusa (${response.status})`)
  }
  const data = await response.json()
  return data.products || []
}

function resolveVariantId(products, entry) {
  if (entry.variant_id) return entry.variant_id

  const handle = entry.variant_handle || entry.product_handle
  if (!handle) return null

  for (const product of products) {
    for (const variant of product.variants || []) {
      const catalogSlug = variant.metadata?.catalog_slug
      if (catalogSlug === handle || variant.sku?.toLowerCase() === handle.replace(/-/g, "_").toLowerCase()) {
        return variant.id
      }
    }
  }

  const product = products.find((item) => item.handle === handle)
  if (!product?.variants?.length) return null

  if (entry.variant_title) {
    const match = product.variants.find((variant) => variant.title === entry.variant_title)
    if (match?.id) return match.id
  }

  return product.variants[0].id
}

async function upsertDocument(client, entry, variantId, storageKey, documentUrl, mediaType) {
  await client.query(
    `
    INSERT INTO lab_batch_documents (
      id, variant_id, batch_number, purity_percent, tested_at, document_type, document_url, storage_key, metadata
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    ON CONFLICT (id) DO UPDATE SET
      variant_id = EXCLUDED.variant_id,
      batch_number = EXCLUDED.batch_number,
      purity_percent = EXCLUDED.purity_percent,
      tested_at = EXCLUDED.tested_at,
      document_type = EXCLUDED.document_type,
      document_url = EXCLUDED.document_url,
      storage_key = EXCLUDED.storage_key,
      metadata = EXCLUDED.metadata,
      updated_at = NOW()
  `,
    [
      entry.id,
      variantId,
      entry.batch_number,
      entry.purity_percent ?? null,
      entry.tested_at ?? null,
      entry.document_type,
      documentUrl,
      storageKey,
      {
        ...(entry.metadata || {}),
        media_type: mediaType
      }
    ]
  )
}

async function run() {
  const r2 = getR2Config()
  if (!r2) {
    console.error("R2 is not configured. Set R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.")
    process.exit(1)
  }

  if (!publishableKey) {
    console.error("NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY is required to resolve variant IDs.")
    process.exit(1)
  }

  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("DATABASE_URL is required")
    process.exit(1)
  }

  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"))
  const products = await fetchProducts()
  const s3 = new S3Client({
    region: process.env.R2_REGION || "auto",
    endpoint: r2.endpoint,
    credentials: {
      accessKeyId: r2.accessKeyId,
      secretAccessKey: r2.secretAccessKey
    }
  })

  const pgClient = new PgClient({
    connectionString,
    ssl:
      connectionString.includes("neon.tech") || connectionString.includes("supabase")
        ? { rejectUnauthorized: false }
        : undefined
  })
  await pgClient.connect()

  let uploaded = 0
  let skipped = 0

  for (const entry of manifest) {
    const variantId = resolveVariantId(products, entry)
    if (!variantId) {
      console.warn(`[skip] ${entry.id}: could not resolve variant for handle ${entry.variant_handle || entry.product_handle}`)
      skipped += 1
      continue
    }

    const { body, ext, contentType, source } = await loadDocumentBody(entry)
    const storageKey = buildStorageKey(entry, variantId, ext)
    const documentUrl = buildPublicUrl(storageKey, r2.publicBaseUrl)
    const mediaType = ext === ".pdf" ? "pdf" : "image"

    if (dryRun) {
      console.log(`[dry-run] ${entry.id} -> ${storageKey} (${contentType}, ${source})`)
      continue
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: r2.bucket,
        Key: storageKey,
        Body: body,
        ContentType: contentType
      })
    )

    await upsertDocument(pgClient, entry, variantId, storageKey, documentUrl, mediaType)
    uploaded += 1
    console.log(`[ok] ${entry.id} -> ${documentUrl}`)
  }

  await pgClient.end()

  if (dryRun) {
    console.log(`\nDry run complete for ${manifest.length} manifest entries (${skipped} skipped).`)
  } else {
    console.log(`\nSynced ${uploaded} COA/HPLC document(s) to R2 (${skipped} skipped).`)
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
