import "server-only"

import {
  compoundSeoProductName,
  getCompoundProductView,
  getProductHref,
  getShelfProductLabel,
  pickDefaultStrengthKey,
  productPath,
  resolveCatalogHandle
} from "@/lib/compound-product"
import { categorySlugFromLabel } from "@/lib/categories"
import { getProductFaqs } from "@/lib/product-faqs"
import { getProductResearchDetail } from "@/lib/product-research-detail"
import { buildResearchOverview } from "@/lib/research-overview"
import { listProducts } from "@/lib/medusa"
import { selectRelatedProducts } from "@/lib/related-products"
import { type AgentMarkdownPage, mdLink, renderQaSection, wrapAgentMarkdown } from "@/lib/agent-markdown/shared"

function renderIdentityTable(view: {
  casNumber: string
  molecularFormula: string
  molecularWeight: string
  sequence: string
  appearance: string
  storage: string
}): string {
  return [
    "## Identity",
    "",
    `- CAS Number: ${view.casNumber}`,
    `- Molecular Formula: ${view.molecularFormula}`,
    `- Molecular Weight: ${view.molecularWeight}`,
    `- Sequence: ${view.sequence}`,
    `- Appearance: ${view.appearance}`,
    `- Storage: ${view.storage}`
  ].join("\n")
}

function renderStrengths(
  strengths: Array<{ strengthLabel: string; purity: string }>
): string {
  const rows = strengths.map((s) => `- ${s.strengthLabel}${s.purity ? ` — ${s.purity} purity` : ""}`)
  return ["## Available Strengths", "", rows.join("\n")].join("\n")
}

export async function getProductAgentMarkdownPage(publicHandle: string): Promise<AgentMarkdownPage | null> {
  const catalogHandle = resolveCatalogHandle(publicHandle)
  const view = await getCompoundProductView(catalogHandle)
  if (!view) return null

  const path = productPath(view.parentHandle)
  const title = compoundSeoProductName(view)
  const description = `Buy ${view.displayName} for qualified laboratory research from Tetrava Labs — HPLC-MS verified purity with lot-linked COA documentation.`

  const defaultStrengthKey = pickDefaultStrengthKey(view.strengths)
  const defaultStrength = view.strengths.find((s) => s.strengthKey === defaultStrengthKey) || view.strengths[0]

  const overview = buildResearchOverview({
    productName: view.displayName,
    category: view.categoryLabel,
    appearance: view.appearance,
    handle: defaultStrength?.handle,
    parentHandle: view.parentHandle,
    customSummary: String(defaultStrength?.metadata?.research_summary || "")
  })

  const researchDetail = getProductResearchDetail(view.parentHandle)
  const faqs = getProductFaqs(view.parentHandle, {
    productName: view.displayName,
    category: view.categoryLabel,
    appearance: view.appearance
  })

  const sections: string[] = [
    `Category: ${mdLink(view.categoryLabel, `/category/${categorySlugFromLabel(view.categoryLabel)}`)}`,
    renderIdentityTable(view),
    renderStrengths(view.strengths)
  ]

  if (researchDetail) {
    sections.push(["## Overview", "", researchDetail.shortDescription.join("\n\n")].join("\n"))
    for (const section of researchDetail.sections) {
      const bulletBlock = section.bullets?.length
        ? `\n\n${section.bullets.map((b) => `- ${b}`).join("\n")}`
        : ""
      sections.push(`### ${section.heading}\n\n${section.paragraphs.join("\n\n")}${bulletBlock}`)
    }
    if (researchDetail.references.length) {
      const refs = researchDetail.references
        .map((ref) => `${ref.id}. ${ref.citation}${ref.url ? ` — ${ref.url}` : ""}`)
        .join("\n")
      sections.push(["## References", "", refs].join("\n"))
    }
  } else {
    sections.push(["## Research Overview", "", overview].join("\n"))
  }

  sections.push(renderQaSection("FAQ", faqs))

  const related = selectRelatedProducts(view.parentHandle, await listProducts(), 3)
  if (related.length) {
    const links = related
      .map((product) => `- ${mdLink(getShelfProductLabel(product), getProductHref(product.handle))}`)
      .join("\n")
    sections.push(["## You may also like", "", links].join("\n"))
  }

  return {
    title,
    description,
    body: wrapAgentMarkdown({
      title,
      description,
      path,
      body: sections.filter(Boolean).join("\n\n")
    })
  }
}
