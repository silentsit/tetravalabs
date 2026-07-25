import { randomBytes } from "node:crypto"
import type { Pool } from "pg"
import { withDb } from "./db"
import type { OrderEmailItem } from "./order-email-templates"
import { normalizeOrderEmailItems } from "./order-email-templates"

const REORDER_TOKEN_TTL_DAYS = 90

export type ReorderTokenItem = OrderEmailItem

function newTokenId() {
  return `ort_${randomBytes(12).toString("hex")}`
}

function generateRawToken() {
  return randomBytes(32).toString("base64url")
}

export function buildStorefrontReorderUrl(rawToken: string) {
  const base = (process.env.STOREFRONT_URL || "https://tetravalabs.com").replace(/\/$/, "")
  return `${base}/reorder/${encodeURIComponent(rawToken)}`
}

/** Create or reuse an active reorder token for an order. */
export async function ensureReorderToken(input: {
  orderId: string
  email: string
  items: ReorderTokenItem[]
}): Promise<{ ok: true; rawToken: string; url: string } | { ok: false; reason: string }> {
  const email = input.email.trim().toLowerCase()
  const items = normalizeOrderEmailItems(input.items)
  if (!email || !input.orderId || !items.length) {
    return { ok: false, reason: "orderId, email, and items are required" }
  }

  const result = await withDb(
    async (db) => {
      const existing = await db.query(
        `
        SELECT id, token
        FROM order_reorder_tokens
        WHERE order_id = $1
          AND used_at IS NULL
          AND expires_at > NOW()
        ORDER BY created_at DESC
        LIMIT 1
        `,
        [input.orderId]
      )

      if (existing.rows[0]?.token) {
        await db.query(
          `
          UPDATE order_reorder_tokens
          SET email = $2, items = $3::jsonb
          WHERE id = $1
          `,
          [existing.rows[0].id, email, JSON.stringify(items)]
        )
        return { rawToken: String(existing.rows[0].token) }
      }

      const rawToken = generateRawToken()
      await db.query(
        `
        INSERT INTO order_reorder_tokens (
          id, token, order_id, email, items, expires_at
        ) VALUES ($1,$2,$3,$4,$5::jsonb, NOW() + ($6 || ' days')::interval)
        `,
        [
          newTokenId(),
          rawToken,
          input.orderId,
          email,
          JSON.stringify(items),
          String(REORDER_TOKEN_TTL_DAYS)
        ]
      )
      return { rawToken }
    },
    async () => null
  )

  if (!result) return { ok: false, reason: "database unavailable" }
  return {
    ok: true,
    rawToken: result.rawToken,
    url: buildStorefrontReorderUrl(result.rawToken)
  }
}

export async function resolveReorderToken(rawToken: string): Promise<
  | {
      ok: true
      orderId: string
      email: string
      items: ReorderTokenItem[]
    }
  | { ok: false; reason: string }
> {
  const token = rawToken.trim()
  if (!token) return { ok: false, reason: "token is required" }

  const row = await withDb(
    async (db: Pool) => {
      const result = await db.query(
        `
        SELECT order_id, email, items, expires_at, used_at
        FROM order_reorder_tokens
        WHERE token = $1
        LIMIT 1
        `,
        [token]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  if (!row) return { ok: false, reason: "Invalid or expired reorder link" }
  // Multi-use until expiry so R1–R3 can share one link and retries work after cart clear.
  if (row.expires_at && new Date(String(row.expires_at)).getTime() < Date.now()) {
    return { ok: false, reason: "This reorder link has expired" }
  }

  return {
    ok: true,
    orderId: String(row.order_id),
    email: String(row.email),
    items: normalizeOrderEmailItems(row.items)
  }
}

export async function markReorderTokenUsed(rawToken: string): Promise<void> {
  await withDb(
    async (db) => {
      await db.query(
        `
        UPDATE order_reorder_tokens
        SET used_at = NOW()
        WHERE token = $1 AND used_at IS NULL
        `,
        [rawToken.trim()]
      )
    },
    async () => undefined
  )
}

/** Load line items from Medusa order tables when email snapshot lacks variantId. */
export async function loadOrderReorderItems(orderId: string): Promise<ReorderTokenItem[]> {
  return withDb(
    async (db) => {
      const result = await db.query(
        `
        SELECT
          oli.title,
          oli.variant_title,
          oi.quantity,
          oli.unit_price,
          oli.product_handle,
          oli.variant_id,
          oli.product_id
        FROM order_item oi
        INNER JOIN order_line_item oli ON oli.id = oi.item_id
        WHERE oi.order_id = $1
          AND oi.deleted_at IS NULL
          AND oli.deleted_at IS NULL
        ORDER BY oli.created_at ASC
        `,
        [orderId]
      )
      return result.rows.map((row) => ({
        title: String(row.title || "Product"),
        variantTitle: row.variant_title ? String(row.variant_title) : undefined,
        quantity: Math.max(1, Math.floor(Number(row.quantity) || 1)),
        unitPrice: Number(row.unit_price || 0) / 100,
        handle: row.product_handle ? String(row.product_handle) : undefined,
        variantId: row.variant_id ? String(row.variant_id) : undefined,
        productId: row.product_id ? String(row.product_id) : undefined
      }))
    },
    async () => []
  )
}
