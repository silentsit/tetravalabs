/**
 * Copy white-background v2 PNGs into the storefront public folder.
 *
 * Source (repo root):
 *   v2-photos-white/
 * Dest:
 *   apps/storefront/public/products/v2/
 *
 * Usage (from repo root):
 *   npm run sync:v2-images
 *   npm run sync:v2-images -- --dry-run
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const storefrontRoot = path.resolve(__dirname, "..")
const workspaceRoot = path.resolve(storefrontRoot, "..", "..")
const sourceCandidates = [
  path.join(workspaceRoot, "v2-photos-white"),
  path.join(
    workspaceRoot,
    "Minor fixes",
    "tetravalabs-shop-revamp",
    "images",
    "v2-photos-white"
  ),
]
const destDir = path.join(storefrontRoot, "public", "products", "v2")
const dryRun = process.argv.includes("--dry-run")

async function resolveSourceDir() {
  for (const candidate of sourceCandidates) {
    try {
      const entries = await fs.readdir(candidate, { withFileTypes: true })
      if (entries.some((entry) => entry.isFile() && entry.name.endsWith(".png"))) {
        return candidate
      }
    } catch {
      // try next candidate
    }
  }
  console.error(
    `Source folder not found. Expected PNGs in one of:\n${sourceCandidates.map((dir) => `  ${dir}`).join("\n")}`
  )
  process.exit(1)
}

async function run() {
  const sourceDir = await resolveSourceDir()
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })
  const pngs = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
  if (pngs.length === 0) {
    console.error(`No PNG files in ${sourceDir}`)
    process.exit(1)
  }

  await fs.mkdir(destDir, { recursive: true })

  let copied = 0
  let skipped = 0

  for (const entry of pngs) {
    const from = path.join(sourceDir, entry.name)
    const to = path.join(destDir, entry.name)

    if (!dryRun) {
      const [srcBuf, dstBuf] = await Promise.all([
        fs.readFile(from),
        fs.readFile(to).catch(() => null),
      ])
      if (dstBuf && srcBuf.equals(dstBuf)) {
        skipped += 1
        continue
      }
      await fs.copyFile(from, to)
    }

    copied += 1
    const label = dryRun ? "[dry-run]" : "[copy]"
    console.log(`${label} ${entry.name}`)
  }

  const summary = dryRun
    ? `Dry run: would copy ${copied} PNG(s) (${pngs.length} in source).`
    : `Synced ${copied} PNG(s), ${skipped} unchanged (${pngs.length} in source).`

  console.log(`\n${summary}`)
  console.log(`Source: ${sourceDir}`)
  console.log(`Dest:   ${destDir}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
