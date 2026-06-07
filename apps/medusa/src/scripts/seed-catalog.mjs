import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..", "..")
const normalizedPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "output",
  "catalog.normalized.json"
)

const run = async () => {
  const content = await fs.readFile(normalizedPath, "utf8")
  const catalog = JSON.parse(content)

  console.log("Catalog file ready for Medusa import.")
  console.log(`Products: ${catalog.products.length}`)
  console.log("Run from workspace root:")
  console.log("  npm run catalog:import")
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
