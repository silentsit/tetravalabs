import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicRoot = path.join(root, "apps", "storefront", "public")
const srcRoot = path.join(root, "apps", "storefront", "src")
const assetPattern = /["'](\/(?:products|v2|brand|images)[^"']+)["']/g

const refs = new Set()

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (/\.(tsx?|css|json|md)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8")
      for (const match of text.matchAll(assetPattern)) refs.add(match[1])
    }
  }
}

walk(srcRoot)

for (const extra of [
  "apps/storefront/src/lib/product-image-map.generated.json",
  "apps/storefront/src/lib/revamp/product-image-map.json",
]) {
  const text = fs.readFileSync(path.join(root, extra), "utf8")
  for (const match of text.matchAll(assetPattern)) refs.add(match[1])
}

const missing = []
for (const url of [...refs].sort()) {
  const rel = url.replace(/^\//, "")
  const filePath = path.join(publicRoot, ...rel.split("/"))
  if (!fs.existsSync(filePath)) missing.push({ url, filePath })
}

console.log(`Referenced static assets: ${refs.size}`)
console.log(`Missing on disk: ${missing.length}`)
for (const item of missing) console.log(`  ${item.url}`)

process.exit(missing.length ? 1 : 0)
