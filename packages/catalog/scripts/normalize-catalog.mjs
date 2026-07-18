import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { resolveStorefrontCategoryName, resolveStorefrontCategorySlug } from "../lib/storefront-categories.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const sourcePath = path.join(workspaceRoot, "product_catalog_usd.json")
const outputDir = path.join(workspaceRoot, "packages", "catalog", "output")
const outputPath = path.join(outputDir, "catalog.normalized.json")
const storefrontHandlesPath = path.join(
  workspaceRoot,
  "apps",
  "storefront",
  "src",
  "lib",
  "catalog-handles.generated.json"
)
const categorySlugsPath = path.join(
  workspaceRoot,
  "apps",
  "storefront",
  "src",
  "lib",
  "category-slugs.generated.json"
)
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

const isNasalSpray = (name) => /nasal\s*spray/i.test(name)

const visualType = (name, strength) => {
  if (isCapsule(name, strength)) return "capsule"
  if (isNasalSpray(name)) return "nasal_spray"
  if (isWaterSolution(name, strength)) return "water_solution"
  if (isBlend(name)) return "blend"
  return "vial"
}

const productTitle = (name, strength) =>
  strength && strength !== "Standard" ? `${name} ${strength}` : name

const defaultPackTiers = (row) => [
  {
    tier: "5 vials",
    qty: 5,
    price_usd: Number(row.price_usd),
    per_unit_usd: Number(row.price_usd) / 5,
    savings_pct: 0
  }
]

const readJsonFile = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8")
  return JSON.parse(raw.replace(/^\uFEFF/, ""))
}

const run = async () => {
  const raw = await readJsonFile(sourcePath)
  const enrichment = await readJsonFile(enrichmentPath)
  const products = []
  const categorySlugsByHandle = {}

  for (const row of raw) {
    const tiers = row.pack_tiers?.length ? row.pack_tiers : defaultPackTiers(row)
    const title = productTitle(row.name, row.strength)
    const enrichmentKey = row.name
    const productHandle = slugify(row.name)

    categorySlugsByHandle[productHandle] = resolveStorefrontCategorySlug(row.name, row.category)

    products.push({
      id: slugify(row.slug),
      title,
      category: resolveStorefrontCategoryName(row.name, row.category),
      source_category: row.category,
      handle: row.slug,
      visual_type: visualType(row.name, row.strength),
      metadata: {
        source: "Tiered_Pricing_5_10_20_Vials.xlsx",
        ruo: true,
        strength: row.strength,
        cas_number: enrichment[enrichmentKey]?.cas_number || null,
        molecular_formula: enrichment[enrichmentKey]?.molecular_formula || null,
        molecular_weight: enrichment[enrichmentKey]?.molecular_weight || null,
        storage: enrichment[enrichmentKey]?.storage || "-20C lyophilized",
        appearance:
          enrichment[enrichmentKey]?.appearance ||
          (isCapsule(row.name, row.strength)
            ? "White capsule"
            : isNasalSpray(row.name)
              ? "Clear nasal solution"
            : isWaterSolution(row.name, row.strength)
              ? "Clear solution"
              : "White lyophilized powder")
      },
      variants: tiers.map((tier) => {
        const qty = Number(tier.qty)
        const isSimpleUnit = qty <= 1
        const variantMeta = {
          catalog_slug: row.slug,
          strength: row.strength
        }
        if (!isSimpleUnit) {
          variantMeta.pack_qty = qty
          variantMeta.per_unit_usd = Number(tier.per_unit_usd)
          variantMeta.savings_pct = Number(tier.savings_pct || 0)
        }
        return {
          id: slugify(`${row.slug}-${tier.qty}-pack`),
          title: isSimpleUnit ? "Standard" : tier.tier,
          sku: `${row.slug.replace(/-/g, "_").toUpperCase()}_${tier.qty}PK`,
          handle: `${row.slug}-${tier.qty}-pack`,
          amount_usd: Number(tier.price_usd),
          currency_code: "usd",
          metadata: variantMeta
        }
      })
    })
  }

  const catalog = {
    generated_at: new Date().toISOString(),
    products
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(catalog, null, 2), "utf8")
  const handles = products.map((product) => product.handle).sort()
  await fs.writeFile(storefrontHandlesPath, `${JSON.stringify(handles, null, 2)}\n`, "utf8")
  await fs.writeFile(categorySlugsPath, `${JSON.stringify(categorySlugsByHandle, null, 2)}\n`, "utf8")
  console.log(
    `Normalized ${catalog.products.length} tiered products to ${outputPath.replaceAll(
      "\\",
      "/"
    )}`
  )
  console.log(
    `Wrote ${handles.length} storefront catalog handles to ${storefrontHandlesPath.replaceAll(
      "\\",
      "/"
    )}`
  )
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
