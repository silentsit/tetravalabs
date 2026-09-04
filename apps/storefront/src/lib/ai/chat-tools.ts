import { tool } from "ai"
import { z } from "zod"
import { faqItems } from "@/lib/faq-content"
import { searchProducts } from "@/lib/search"
import { getProductByHandle } from "@/lib/medusa"
import { getVariantPriceCents } from "@/lib/product-price"
import { getProductHref } from "@/lib/compound-product"
import { normalizeTb500DisplayText } from "@/lib/revamp/product-visual"

const MEDUSA_URL = (process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000").replace(
  /\/$/,
  ""
)
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export const chatTools = {
  listFaq: tool({
    description: "Search Tetrava Labs FAQ answers about RUO, shipping, COA, returns, storage.",
    inputSchema: z.object({
      query: z.string().describe("Keywords from the customer question")
    }),
    execute: async ({ query }) => {
      const q = query.toLowerCase()
      const matches = faqItems
        .filter(
          (item) =>
            item.question.toLowerCase().includes(q) ||
            item.answer.toLowerCase().includes(q) ||
            q.split(/\s+/).some((word) => word.length > 3 && item.answer.toLowerCase().includes(word))
        )
        .slice(0, 5)
      return {
        matches: matches.length ? matches : faqItems.slice(0, 4),
        note: "Answers are RUO-safe store FAQ snippets."
      }
    }
  }),

  searchProducts: tool({
    description: "Search the Tetrava Labs research peptide catalog by name or keyword.",
    inputSchema: z.object({
      query: z.string().min(1).describe("Product name or keyword")
    }),
    execute: async ({ query }) => {
      const { results, source } = await searchProducts(query)
      return {
        source,
        products: results.slice(0, 8).map((p) => ({
          title: p.title,
          handle: p.handle,
          href: getProductHref(p.handle),
          category: p.category,
          priceMinUsd: (p.unit_price_min ?? p.price_min) / 100,
          priceMaxUsd: (p.unit_price_max ?? p.price_max) / 100
        }))
      }
    }
  }),

  getShippingPolicy: tool({
    description: "Return shipping, tracking, and cold-chain policy summary.",
    inputSchema: z.object({}),
    execute: async () => ({
      summary:
        "Orders typically process within 12 hours. Lyophilized peptides ship with temperature-controlled packaging where required. Typical windows: 2–7 business days (USA/Canada/Australia/UK), 2–4 (SEA), 5–11 (rest of world). Tracking is emailed after dispatch. Customs/duties are the recipient's responsibility. Shipping is free on all orders worldwide.",
      href: "/shipping"
    })
  }),

  getOrderStatus: tool({
    description: "Look up a guest order by checkout email and display order number.",
    inputSchema: z.object({
      email: z.string().email(),
      displayId: z.number().int().positive()
    }),
    execute: async ({ email, displayId }) => {
      const url = new URL(`${MEDUSA_URL}/store/orders/lookup`)
      url.searchParams.set("email", email)
      url.searchParams.set("display_id", String(displayId))
      const response = await fetch(url.toString(), {
        headers: PUBLISHABLE_KEY ? { "x-publishable-api-key": PUBLISHABLE_KEY } : {},
        cache: "no-store"
      })
      const data = await response.json()
      if (!response.ok) {
        return { found: false, message: data.message || "Order not found" }
      }
      return {
        found: true,
        order: {
          id: data.order.id,
          displayId: data.order.display_id,
          status: data.order.status,
          totalUsd: Number(data.order.total || 0) / 100,
          itemCount: Array.isArray(data.order.items) ? data.order.items.length : 0
        },
        accountHref: "/account/orders"
      }
    }
  }),

  addToCart: tool({
    description:
      "Add one-time catalog lines to the customer cart by product handle (and optional variant title). Resolves real variant IDs and prices from Medusa — never invent IDs.",
    inputSchema: z.object({
      items: z
        .array(
          z.object({
            handle: z.string().min(1),
            variantTitle: z.string().optional(),
            quantity: z.number().int().positive().default(1)
          })
        )
        .min(1)
        .max(5)
    }),
    execute: async ({ items }) => {
      const resolved: Array<{
        variantId: string
        productId: string
        handle: string
        title: string
        variantTitle: string
        unitPrice: number
        quantity: number
      }> = []
      const skipped: string[] = []

      for (const line of items) {
        const product = await getProductByHandle(line.handle)
        if (!product?.variants?.length) {
          skipped.push(line.handle)
          continue
        }
        const want = (line.variantTitle || "").trim().toLowerCase()
        const variant =
          (want
            ? product.variants.find((v) => (v.title || "").toLowerCase() === want)
            : null) || product.variants[0]
        const cents = getVariantPriceCents(variant)
        if (!variant?.id || cents <= 0) {
          skipped.push(line.handle)
          continue
        }
        resolved.push({
          variantId: variant.id,
          productId: product.id,
          handle: product.handle,
          title: normalizeTb500DisplayText(product.title),
          variantTitle: normalizeTb500DisplayText(variant.title || ""),
          unitPrice: cents / 100,
          quantity: line.quantity || 1
        })
      }

      return {
        action: "add_to_cart" as const,
        items: resolved,
        skipped,
        note:
          resolved.length > 0
            ? "Client widget applies these one-time lines."
            : "No resolvable catalog variants."
      }
    }
  })
}
