import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"

type LookupRow = {
  id: string
  display_id: number
  email: string
  status: string
  currency_code: string
  created_at: string
  total: string | null
}

/**
 * GET /store/orders/lookup?email=&display_id=
 * Guest order lookup — requires matching checkout email + order number.
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const email = String(req.query.email || "")
    .trim()
    .toLowerCase()
  const displayId = Number(req.query.display_id)

  if (!email || !Number.isFinite(displayId) || displayId <= 0) {
    return res.status(400).json({ message: "email and display_id are required" })
  }

  const row = await withDb(
    async (db) => {
      const result = await db.query<LookupRow>(
        `
        SELECT
          o.id,
          o.display_id,
          o.email,
          o.status,
          o.currency_code,
          o.created_at,
          os.totals->>'current_order_total' AS total
        FROM "order" o
        LEFT JOIN order_summary os ON os.order_id = o.id
        WHERE o.display_id = $1
          AND LOWER(o.email) = $2
          AND o.deleted_at IS NULL
        LIMIT 1
        `,
        [displayId, email]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  if (!row) {
    return res.status(404).json({ message: "Order not found" })
  }

  return res.json({
    order: {
      id: row.id,
      display_id: row.display_id,
      email: row.email,
      status: row.status,
      currency_code: row.currency_code,
      created_at: row.created_at,
      total: Number(row.total || 0)
    }
  })
}
