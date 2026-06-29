import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const paths = execSync("git ls-files", { cwd: root, encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean)

const prefixes = [
  "apps/storefront/",
  "apps/medusa/",
  "packages/catalog/",
  "packages/sanity-studio/",
  "scripts/render-build.mjs",
  "scripts/sync-next-output.mjs",
  "product_catalog_usd.json",
  "render.yaml",
  "vercel.json",
  "v2-photos-white/",
  "patches/",
]

const scoped = paths.filter((file) =>
  prefixes.some((prefix) => file === prefix.replace(/\/$/, "") || file.startsWith(prefix))
)

const missing = scoped.filter((file) => !fs.existsSync(path.join(root, file)))

console.log(`Scoped tracked files: ${scoped.length}`)
console.log(`Missing on disk: ${missing.length}`)
for (const file of missing) console.log(`  ${file}`)

process.exit(missing.length ? 1 : 0)
