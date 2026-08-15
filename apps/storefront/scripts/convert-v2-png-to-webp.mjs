/**
 * Convert public/products/v2 PNG shots to WebP (max 800px, q82) and
 * optionally delete the PNG after a successful write.
 *
 * Usage (from repo root):
 *   node apps/storefront/scripts/convert-v2-png-to-webp.mjs
 *   node apps/storefront/scripts/convert-v2-png-to-webp.mjs --keep-png
 */
import fs from "node:fs/promises"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const keepPng = process.argv.includes("--keep-png")
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const v2Dir = path.join(root, "public", "products", "v2")
const MAX_WIDTH = 800
const QUALITY = 82

async function loadSharp() {
  const candidates = [
    path.join(root, "node_modules", "sharp"),
    path.join(root, "..", "..", "node_modules", "sharp"),
  ]
  for (const candidate of candidates) {
    try {
      return require(candidate)
    } catch {
      // try next
    }
  }
  throw new Error("sharp is not installed. Run: npm install sharp --no-save --workspace=@tetrava/storefront")
}

async function walkPngs(dir) {
  const out = []
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await walkPngs(full)))
      continue
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".png")) {
      out.push(full)
    }
  }
  return out
}

async function run() {
  const sharp = await loadSharp()
  const files = await walkPngs(v2Dir)
  let converted = 0
  let pngBytes = 0
  let webpBytes = 0

  for (const src of files) {
    const dest = src.replace(/\.png$/i, ".webp")
    const input = sharp(src)
    const meta = await input.metadata()
    const pipeline =
      meta.width && meta.width > MAX_WIDTH
        ? input.resize({ width: MAX_WIDTH, withoutEnlargement: true })
        : input
    await pipeline.webp({ quality: QUALITY, effort: 4 }).toFile(dest)

    const [srcStat, destStat] = await Promise.all([fs.stat(src), fs.stat(dest)])
    pngBytes += srcStat.size
    webpBytes += destStat.size
    converted += 1
    if (!keepPng) await fs.unlink(src)
    const rel = path.relative(v2Dir, src)
    console.log(
      `${rel}  ${(srcStat.size / 1024).toFixed(1)}KB -> ${(destStat.size / 1024).toFixed(1)}KB`
    )
  }

  console.log(
    `\nConverted ${converted} PNG(s). ${(pngBytes / 1024 / 1024).toFixed(1)} MB -> ${(webpBytes / 1024 / 1024).toFixed(1)} MB. PNG ${keepPng ? "kept" : "removed"}.`
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
