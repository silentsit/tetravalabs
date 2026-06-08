import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"

type Body = {
  disclaimer_version?: string
  acknowledged_at?: string
  order_id?: string
  shipping_country?: string
  ip_country?: string
}

/**
 * POST /store/compliance/acknowledge
 * Persists acknowledgement to session/cart metadata in production wiring.
 */
export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const disclaimerVersion = req.body?.disclaimer_version || "v1"
  const acknowledgedAt = req.body?.acknowledged_at || new Date().toISOString()
  const orderId = req.body?.order_id

  if (orderId) {
    await withDb(
      async (db) => {
        await db.query(
          `
          INSERT INTO order_compliance_records (
            order_id, disclaimer_version, acknowledged_at, shipping_country, ip_country
          ) VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (order_id) DO UPDATE SET
            disclaimer_version = EXCLUDED.disclaimer_version,
            acknowledged_at = EXCLUDED.acknowledged_at,
            shipping_country = EXCLUDED.shipping_country,
            ip_country = EXCLUDED.ip_country
        `,
          [
            orderId,
            disclaimerVersion,
            acknowledgedAt,
            req.body?.shipping_country ?? null,
            req.body?.ip_country ?? null
          ]
        )
      },
      async () => undefined
    )
  }

  return res.status(200).json({
    acknowledged: true,
    disclaimer_version: disclaimerVersion,
    acknowledged_at: acknowledgedAt,
    order_id: orderId || null
  })
}
