import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  isTypesenseConfigured,
  searchTypesenseProducts,
  type TypesenseSearchFilters
} from "../../../lib/typesense-search"

function parseFilters(req: MedusaRequest): TypesenseSearchFilters {
  const category = String(req.query.category || "").trim() || undefined
  const priceMinRaw = req.query.price_min
  const priceMaxRaw = req.query.price_max
  const priceMin =
    priceMinRaw != null && priceMinRaw !== "" ? Number(priceMinRaw) : undefined
  const priceMax =
    priceMaxRaw != null && priceMaxRaw !== "" ? Number(priceMaxRaw) : undefined

  return {
    category,
    priceMin: Number.isFinite(priceMin) ? priceMin : undefined,
    priceMax: Number.isFinite(priceMax) ? priceMax : undefined
  }
}

/**
 * GET /store/search?q=...&category=...&price_min=...&price_max=...
 * Proxies Typesense for the Vercel storefront (private network on Render).
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = String(req.query.q || "").trim()
  const filters = parseFilters(req)
  const hasFilters = Boolean(filters.category || filters.priceMin != null || filters.priceMax != null)

  if (!query && !hasFilters) {
    return res.status(400).json({ message: "Query parameter q or a filter is required." })
  }

  if (!isTypesenseConfigured()) {
    return res.status(503).json({
      message: "Typesense is not configured.",
      typesense_configured: false
    })
  }

  const results = await searchTypesenseProducts(query, filters)
  if (results === null) {
    return res.status(502).json({
      message: "Typesense search failed.",
      typesense_configured: true
    })
  }

  return res.json({
    q: query,
    filters,
    count: results.length,
    results,
    source: "typesense",
    typesense_configured: true
  })
}
