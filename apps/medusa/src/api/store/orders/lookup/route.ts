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

  const items = await withDb(
    async (db) => {
      const result = await db.query(
        `
        SELECT
          oli.id,
          oli.title,
          oli.variant_title,
          oi.quantity,
          oli.unit_price,
          oli.product_handle,
          oli.variant_id,
          oli.product_id,
          oli.product_title
        FROM order_item oi
        INNER JOIN order_line_item oli ON oli.id = oi.item_id
        WHERE oi.order_id = $1
          AND oi.deleted_at IS NULL
          AND oli.deleted_at IS NULL
        ORDER BY oli.created_at ASC
        `,
        [row.id]
      )
      return result.rows.map((item) => ({
        id: String(item.id),
        title: String(item.product_title || item.title || "Product"),
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
        unit_price: Number(item.unit_price || 0),
        variant_id: item.variant_id ? String(item.variant_id) : undefined,
        product_id: item.product_id ? String(item.product_id) : undefined,
        product: {
          id: item.product_id ? String(item.product_id) : undefined,
          handle: item.product_handle ? String(item.product_handle) : undefined,
          title: String(item.product_title || item.title || "Product")
        },
        variant: {
          id: item.variant_id ? String(item.variant_id) : undefined,
          title: item.variant_title ? String(item.variant_title) : undefined
        }
      }))
    },
    async () => []
  )

  return res.json({
    order: {
      id: row.id,
      display_id: row.display_id,
      email: row.email,
      status: row.status,
      currency_code: row.currency_code,
      created_at: row.created_at,
      total: Number(row.total || 0),
      items
    }
  })
}
