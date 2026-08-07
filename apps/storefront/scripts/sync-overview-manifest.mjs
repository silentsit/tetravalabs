/**
 * Scan public/images/overview for {handle}-{1,2,3}.webp and write manifest JSON.
 * Usage: node apps/storefront/scripts/sync-overview-manifest.mjs
 */
import fs from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"

const root = path.dirname(fileURLToPath(import.meta.url))
const overviewDir = path.join(root, "../public/images/overview")
const outPath = path.join(root, "../src/lib/overview-images.generated.json")

async function run() {
  const files = await fs.readdir(overviewDir).catch(() => [])
  const byHandle = new Map()

  for (const file of files) {
    const match = file.match(/^([a-z0-9-]+)-([123])\.webp$/i)
    if (!match) continue
    const handle = match[1].toLowerCase()
    const slot = Number(match[2])
    if (!byHandle.has(handle)) byHandle.set(handle, new Set())
    byHandle.get(handle).add(slot)
  }

  const complete = [...byHandle.entries()]
    .filter(([, slots]) => slots.has(1) && slots.has(2) && slots.has(3))
    .map(([handle]) => handle)
    .sort()

  const payload = { handles: complete }
  await fs.writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8")
  console.log(`Wrote ${complete.length} curated overview sets → ${path.relative(process.cwd(), outPath)}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
