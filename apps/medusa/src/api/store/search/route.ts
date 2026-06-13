import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { isTypesenseConfigured, searchTypesenseProducts } from "../../../lib/typesense-search"

/**
 * GET /store/search?q=...
 * Proxies Typesense for the Vercel storefront (private network on Render).
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = String(req.query.q || "").trim()

  if (!query) {
    return res.status(400).json({ message: "Query parameter q is required." })
  }

  if (!isTypesenseConfigured()) {
    return res.status(503).json({
      message: "Typesense is not configured.",
      typesense_configured: false
    })
  }

  const results = await searchTypesenseProducts(query)
  if (results === null) {
    return res.status(502).json({
      message: "Typesense search failed.",
      typesense_configured: true
    })
  }

  return res.json({
    q: query,
    count: results.length,
    results,
    source: "typesense",
    typesense_configured: true
  })
}
