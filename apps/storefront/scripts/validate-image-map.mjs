import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const v2Dir = path.join(root, "public", "products", "v2")
const map = JSON.parse(
  fs.readFileSync(path.join(root, "src/lib/product-image-map.generated.json"), "utf8")
)

const files = new Set(fs.readdirSync(v2Dir))
const errors = []
let pngCount = 0
let svgCount = 0

for (const [handle, url] of Object.entries(map)) {
  const base = path.basename(url)
  if (!files.has(base)) errors.push(`missing file: ${handle} -> ${base}`)
  if (url.endsWith(".png")) pngCount++
  if (url.endsWith(".svg")) svgCount++
}

console.log(`handles: ${Object.keys(map).length}`)
console.log(`png: ${pngCount}, svg: ${svgCount}`)
console.log(`errors: ${errors.length}`)
if (errors.length) console.log(errors.join("\n"))
else console.log("ok")

process.exit(errors.length ? 1 : 0)
