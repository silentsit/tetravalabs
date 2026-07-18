import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { formatOpaqueSku, resolveProductCodeRegistry } from "../lib/opaque-sku.mjs"
import { resolveStorefrontCategoryName, resolveStorefrontCategorySlug } from "../lib/storefront-categories.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, "..", "..", "..")
const sourcePath = path.join(workspaceRoot, "product_catalog_usd.json")
const outputDir = path.join(workspaceRoot, "packages", "catalog", "output")
const outputPath = path.join(outputDir, "catalog.normalized.json")
const skuRegistryPath = path.join(outputDir, "sku-registry.json")
const productCodeRegistryPath = path.join(
  workspaceRoot,
  "packages",
  "catalog",
  "data",
  "product-sku-ids.json"
)
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
const skuLookupPath = path.join(
  workspaceRoot,
  "apps",
  "storefront",
  "src",
  "lib",
  "catalog-skus.generated.json"
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
  const handles = raw.map((row) => row.slug).filter(Boolean)
  const codeRegistry = await resolveProductCodeRegistry(handles, productCodeRegistryPath, fs)

  const products = []
  const categorySlugsByHandle = {}
  const skuRegistry = {}

  for (const row of raw) {
    const tiers = row.pack_tiers?.length ? row.pack_tiers : defaultPackTiers(row)
    const title = productTitle(row.name, row.strength)
    const enrichmentKey = row.name
    const productHandle = slugify(row.name)
    const productCode = Number(codeRegistry.products[row.slug])

    if (!Number.isFinite(productCode) || productCode < 1) {
      throw new Error(`Missing opaque product code for handle: ${row.slug}`)
    }

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
        product_code: productCode,
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
        const packQty = isSimpleUnit ? 1 : qty
        const sku = formatOpaqueSku(productCode, packQty)
        const variantMeta = {
          catalog_slug: row.slug,
          strength: row.strength,
          product_code: productCode
        }
        if (!isSimpleUnit) {
          variantMeta.pack_qty = qty
          variantMeta.per_unit_usd = Number(tier.per_unit_usd)
          variantMeta.savings_pct = Number(tier.savings_pct || 0)
        }
        skuRegistry[sku] = {
          handle: row.slug,
          title,
          pack_qty: packQty,
          variant_title: isSimpleUnit ? "Standard" : tier.tier
        }
        return {
          id: slugify(`${row.slug}-${tier.qty}-pack`),
          title: isSimpleUnit ? "Standard" : tier.tier,
          sku,
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
    sku_scheme: "TV-####-##",
    products
  }

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputPath, JSON.stringify(catalog, null, 2), "utf8")
  await fs.writeFile(skuRegistryPath, `${JSON.stringify(skuRegistry, null, 2)}\n`, "utf8")

  const sortedHandles = products.map((product) => product.handle).sort()
  const skuByKey = {}
  const productCodes = {}
  for (const product of products) {
    const productCode = Number(product.metadata.product_code)
    productCodes[product.handle] = productCode
    for (const variant of product.variants) {
      const packQty = Number(variant.metadata?.pack_qty) > 0 ? Number(variant.metadata.pack_qty) : 1
      skuByKey[`${product.handle}:${packQty}`] = variant.sku
      skuByKey[`${product.handle}::${variant.title}`] = variant.sku
    }
  }

  const storefrontSkuPayload = {
    scheme: "TV-####-##",
    generated_at: catalog.generated_at,
    skus: skuByKey,
    productCodes
  }

  await fs.writeFile(storefrontHandlesPath, `${JSON.stringify(sortedHandles, null, 2)}\n`, "utf8")
  await fs.writeFile(categorySlugsPath, `${JSON.stringify(categorySlugsByHandle, null, 2)}\n`, "utf8")
  await fs.writeFile(skuLookupPath, `${JSON.stringify(storefrontSkuPayload, null, 2)}\n`, "utf8")

  console.log(
    `Normalized ${catalog.products.length} tiered products to ${outputPath.replaceAll("\\", "/")}`
  )
  console.log(
    `Opaque SKU scheme TV-####-## — ${Object.keys(skuRegistry).length} variant SKUs`
  )
  console.log(
    `Wrote stable product codes to ${productCodeRegistryPath.replaceAll("\\", "/")}`
  )
  console.log(
    `Wrote ${sortedHandles.length} storefront catalog handles to ${storefrontHandlesPath.replaceAll(
      "\\",
      "/"
    )}`
  )
  console.log(`Wrote SKU lookup to ${skuLookupPath.replaceAll("\\", "/")}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
