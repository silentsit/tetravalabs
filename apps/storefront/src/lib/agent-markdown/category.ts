import "server-only"

import { listProducts } from "@/lib/medusa"
import {
  categoryLabelFromSlug,
  filterProductsByCategorySlug,
  isStorefrontCategorySlug,
  normalizeCategorySlug
} from "@/lib/categories"
import { dedupeProductsByCompound, getShelfProductLabel, getProductHref } from "@/lib/compound-product"
import { getCategorySeoBlock } from "@/lib/sanity"
import { type AgentMarkdownPage, wrapAgentMarkdown } from "@/lib/agent-markdown/shared"

export async function getCategoryAgentMarkdownPage(rawSlug: string): Promise<AgentMarkdownPage | null> {
  const normalized = normalizeCategorySlug(rawSlug)
  if (!isStorefrontCategorySlug(normalized)) return null

  const products = await listProducts()
  const label = categoryLabelFromSlug(normalized, products)
  const seo = await getCategorySeoBlock(normalized)
  const path = `/category/${normalized}`

  const description =
    seo?.seoDescription ||
    seo?.introCopy ||
    `Shop ${label} research peptides with verified 99%+ HPLC-MS purity, lot-linked COAs, and cold-chain shipping. Research use only (RUO).`

  const categoryProducts = dedupeProductsByCompound(filterProductsByCategorySlug(products, normalized))
  const productLines = categoryProducts
    .map((product) => `- [${getShelfProductLabel(product)}](${getProductHref(product.handle)})`)
    .join("\n")

  return {
    title: `${label} Research Peptides`,
    description,
    body: wrapAgentMarkdown({
      title: `${label} Research Peptides`,
      description,
      path,
      body: [
        seo?.introCopy || description,
        seo?.supportingCopy || "",
        `## Products in ${label}`,
        productLines || "No products currently listed in this category."
      ]
        .filter(Boolean)
        .join("\n\n")
    })
  }
}
