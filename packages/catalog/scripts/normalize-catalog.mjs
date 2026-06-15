import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { resolveStorefrontCategoryName } from "../lib/storefront-categories.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const sourcePath = path.join(workspaceRoot, "product_catalog_usd.json")
const outputDir = path.join(workspaceRoot, "packages", "catalog", "output")
const outputPath = path.join(outputDir, "catalog.normalized.json")
const enrichmentPath = path.join(workspaceRoot, "packages", "catalog", "data", "product-enrichment.json")

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const isCapsule = (name, strength) =>
  /(capsule|capsules)/i.test(`${name} ${strength}`)

const isWaterSolution = (name, strength) =>
  /(water|alcohol|10ml|3ml|solution|lipo-c|lemon bottle|l-carnitine)/i.test(
    `${name} ${strength}`
  )

const isBlend = (name) => /(blend|\+)/i.test(name)

const visualType = (name, strength) => {
  if (isCapsule(name, strength)) return "capsule"
  if (isWaterSolution(name, strength)) return "water_solution"
  if (isBlend(name)) return "blend"
  return "vial"
}

const toProductId = (name, category) => slugify(`${category}-${name}`)

const toVariantId = (name, strength) => slugify(`${name}-${strength}`)

const run = async () => {
  const raw = JSON.parse(await fs.readFile(sourcePath, "utf8"))
  const enrichment = JSON.parse(await fs.readFile(enrichmentPath, "utf8"))
  const grouped = new Map()

  for (const row of raw) {
    const productId = toProductId(row.name, row.category)
    if (!grouped.has(productId)) {
      grouped.set(productId, {
        id: productId,
        title: row.name,
        category: row.storefront_category || resolveStorefrontCategoryName(row.name, row.category),
        source_category: row.category,
        handle: slugify(row.name),
        visual_type: visualType(row.name, row.strength),
        metadata: {
          source: "USD-PRICING.xlsx",
          ruo: true,
          cas_number: enrichment[row.name]?.cas_number || null,
          molecular_formula: enrichment[row.name]?.molecular_formula || null,
          molecular_weight: enrichment[row.name]?.molecular_weight || null,
          storage: enrichment[row.name]?.storage || "-20C lyophilized",
          appearance:
            enrichment[row.name]?.appearance ||
            (isCapsule(row.name, row.strength)
              ? "White capsule"
              : isWaterSolution(row.name, row.strength)
                ? "Clear solution"
                : "White lyophilized powder")
        },
        variants: []
      })
    }

    grouped.get(productId).variants.push({
      id: toVariantId(row.name, row.strength),
      title: row.strength,
      sku: row.slug.toUpperCase().replace(/-/g, "_"),
      handle: row.slug,
      amount_usd: Number(row.price_usd),
      currency_code: "usd",
      metadata: {
        strength: row.strength,
        catalog_slug: row.slug,
        dosage_mg: Number((row.strength.match(/(\d+)\s*mg/i) || [])[1] || 0)
      }
    })
  }

  const catalog = {
    generated_at: new Date().toISOString(),
    products: Array.from(grouped.values())
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(catalog, null, 2), "utf8")
  console.log(
    `Normalized ${catalog.products.length} products to ${outputPath.replaceAll(
      "\\",
      "/"
    )}`
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
