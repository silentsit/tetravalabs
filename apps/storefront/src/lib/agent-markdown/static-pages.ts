import "server-only"

import { faqItems } from "@/lib/faq-content"
import { siteConfig } from "@/lib/seo"
import { STOREFRONT_CATEGORY_SLUGS, CATEGORY_NAME_BY_SLUG } from "@/lib/categories"
import { type AgentMarkdownPage, mdLink, renderQaSection, wrapAgentMarkdown } from "@/lib/agent-markdown/shared"

type StaticPageBuilder = () => AgentMarkdownPage

function categoryListMarkdown(): string {
  return STOREFRONT_CATEGORY_SLUGS.map(
    (slug) => `- ${mdLink(CATEGORY_NAME_BY_SLUG[slug], `/category/${slug}`)}`
  ).join("\n")
}

const STATIC_PAGE_BUILDERS: Record<string, StaticPageBuilder> = {
  "/": () => ({
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    body: wrapAgentMarkdown({
      title: siteConfig.name,
      description: siteConfig.description,
      path: "/",
      body: [
        `${siteConfig.name} supplies research-grade peptides and lab supplies with HPLC-MS purity verification, lot-linked Certificates of Analysis (COA), and cold-chain shipping for qualified laboratories.`,
        "## Product Categories",
        categoryListMarkdown(),
        "## Key Pages",
        [
          mdLink("Shop catalog", "/shop"),
          mdLink("COA Library", "/coa-library"),
          mdLink("Research Hub (blog)", "/blog"),
          mdLink("FAQ", "/faq"),
          mdLink("Shipping", "/shipping"),
          mdLink("Payment guide", "/payment"),
          mdLink("About", "/about")
        ]
          .map((link) => `- ${link}`)
          .join("\n")
      ].join("\n\n")
    })
  }),

  "/shop": () => ({
    title: "Shop Research Peptides",
    description: "Browse the full Tetrava Labs catalog of research peptides and lab supplies by category.",
    body: wrapAgentMarkdown({
      title: "Shop Research Peptides",
      description: "Browse the full Tetrava Labs catalog of research peptides and lab supplies by category.",
      path: "/shop",
      body: [
        "The shop lists every active catalog product, each with HPLC-MS purity data, strength/pack options, and a lot-linked Certificate of Analysis when published.",
        "## Categories",
        categoryListMarkdown()
      ].join("\n\n")
    })
  }),

  "/categories": () => ({
    title: "Research Peptide Categories",
    description: "All Tetrava Labs research peptide categories with links to each category page.",
    body: wrapAgentMarkdown({
      title: "Research Peptide Categories",
      description: "All Tetrava Labs research peptide categories with links to each category page.",
      path: "/categories",
      body: ["## Categories", categoryListMarkdown()].join("\n\n")
    })
  }),

  "/blog": () => ({
    title: "Research Hub",
    description: "Tetrava Labs research articles on peptide handling, analytical verification, and compliance.",
    body: wrapAgentMarkdown({
      title: "Research Hub",
      description: "Tetrava Labs research articles on peptide handling, analytical verification, and compliance.",
      path: "/blog",
      body:
        "Long-form articles covering reconstitution protocols, COA/HPLC interpretation, and RUO compliance, authored and reviewed by the Tetrava Labs scientific editorial team. Individual posts negotiate markdown at their own canonical URL (`/blog/{slug}`)."
    })
  }),

  "/coa-library": () => ({
    title: "COA Library",
    description: "Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptide batches.",
    body: wrapAgentMarkdown({
      title: "COA Library",
      description: "Search lot-linked Certificates of Analysis (COA) for Tetrava Labs research peptide batches.",
      path: "/coa-library",
      body:
        "Every published COA documents independent third-party HPLC-MS purity, identity, and batch data for a specific lot. Match the batch number on your vial to the COA before starting comparative research work."
    })
  }),

  "/about": () => ({
    title: `About ${siteConfig.name}`,
    description: siteConfig.description,
    body: wrapAgentMarkdown({
      title: `About ${siteConfig.name}`,
      description: siteConfig.description,
      path: "/about",
      body: [
        `${siteConfig.name} ("${siteConfig.tagline}") supplies research-grade peptides and lab supplies to qualified laboratories, with every batch backed by independent third-party HPLC-MS purity verification.`,
        `Contact: ${siteConfig.contactEmail}`
      ].join("\n\n")
    })
  }),

  "/contact": () => ({
    title: `Contact ${siteConfig.name}`,
    description: `How to reach the ${siteConfig.name} research support team.`,
    body: wrapAgentMarkdown({
      title: `Contact ${siteConfig.name}`,
      description: `How to reach the ${siteConfig.name} research support team.`,
      path: "/contact",
      body: `For order, COA, or institutional-account questions, contact ${siteConfig.contactEmail}.`
    })
  }),

  "/faq": () => ({
    title: "Frequently Asked Questions",
    description: "Answers about RUO compliance, purity verification, shipping, storage, and returns.",
    body: wrapAgentMarkdown({
      title: "Frequently Asked Questions",
      description: "Answers about RUO compliance, purity verification, shipping, storage, and returns.",
      path: "/faq",
      body: renderQaSection("FAQ", faqItems)
    })
  }),

  "/shipping": () => ({
    title: "Shipping",
    description: "Tetrava Labs shipping methods, delivery windows, and tracking guidance.",
    body: wrapAgentMarkdown({
      title: "Shipping",
      description: "Tetrava Labs shipping methods, delivery windows, and tracking guidance.",
      path: "/shipping",
      body: [
        "Orders are processed within 12 hours and ship with temperature-controlled, discreet packaging where appropriate for lyophilized peptides.",
        "Shipping is free on all orders worldwide. Typical delivery windows: 2–7 business days (USA, Canada, Australia, UK); 2–4 business days (South-East Asia); 5–11 business days (rest of world). Customs fees and import duties are the recipient's responsibility.",
        "Tracking is emailed after dispatch — use Post Track or 17 Track for the most accurate updates."
      ].join("\n\n")
    })
  }),

  "/payment": () => ({
    title: "Payment",
    description: "Payment options for qualified Tetrava Labs research buyers.",
    body: wrapAgentMarkdown({
      title: "Payment",
      description: "Payment options for qualified Tetrava Labs research buyers.",
      path: "/payment",
      body:
        "Tetrava Labs accepts crypto and card payment options for qualified buyers. Payment instructions are provided after checkout — see the full guide at the canonical URL above for current methods and steps."
    })
  }),

  "/terms": () => ({
    title: "Terms of Service",
    description: "Tetrava Labs Terms of Service for research peptide purchases.",
    body: wrapAgentMarkdown({
      title: "Terms of Service",
      description: "Tetrava Labs Terms of Service for research peptide purchases.",
      path: "/terms",
      body:
        "Full Terms of Service govern use of this site and all research peptide purchases, including the Research Use Only (RUO) restriction. Read the complete terms at the canonical URL above."
    })
  }),

  "/privacy": () => ({
    title: "Privacy Policy",
    description: "How Tetrava Labs collects, uses, and protects customer data.",
    body: wrapAgentMarkdown({
      title: "Privacy Policy",
      description: "How Tetrava Labs collects, uses, and protects customer data.",
      path: "/privacy",
      body:
        "The Privacy Policy explains what customer and order data Tetrava Labs collects, how it is used, and how to exercise data rights. Read the complete policy at the canonical URL above."
    })
  }),

  "/refund": () => ({
    title: "Refund & Delivery Policy",
    description: "Tetrava Labs return, refund, and delivery policy for research peptide orders.",
    body: wrapAgentMarkdown({
      title: "Refund & Delivery Policy",
      description: "Tetrava Labs return, refund, and delivery policy for research peptide orders.",
      path: "/refund",
      body:
        "Due to the nature of research compounds, opened or used products cannot be returned. Unopened products may qualify for store credit within 14 days of delivery. Contact support to initiate a return review. See the canonical URL above for the complete policy."
    })
  }),

  "/ruo": () => ({
    title: "Research Use Only (RUO) Disclaimer",
    description: "Full Research Use Only compliance disclaimer for Tetrava Labs products.",
    body: wrapAgentMarkdown({
      title: "Research Use Only (RUO) Disclaimer",
      description: "Full Research Use Only compliance disclaimer for Tetrava Labs products.",
      path: "/ruo",
      body:
        "All Tetrava Labs products are sold strictly for in-vitro / laboratory research (RUO). They are not approved for human consumption, diagnostic use, therapeutic applications, or veterinary use. Buyers must confirm they are qualified researchers or institutions. See the canonical URL above for the complete disclaimer."
    })
  })
}

export function getStaticAgentMarkdownPage(path: string): AgentMarkdownPage | null {
  const builder = STATIC_PAGE_BUILDERS[path]
  return builder ? builder() : null
}

export function isStaticAgentMarkdownPath(path: string): boolean {
  return path in STATIC_PAGE_BUILDERS
}
