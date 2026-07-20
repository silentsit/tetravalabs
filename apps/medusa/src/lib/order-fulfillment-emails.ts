import { withDb } from "./db"
import {
  buildOrderShippedEmail,
  buildStorefrontContactUrl,
  buildStorefrontOrdersUrl,
  buildTrackingSlaEmail,
  normalizeOrderEmailItems,
  orderLabelFrom,
  TRACKING_SLA_HOURS,
  type OrderEmailItem
} from "./order-email-templates"

type FulfillmentRow = {
  order_id: string
  email: string
  display_id: number | null
  items: OrderEmailItem[]
  tracking_sla_sent_at: string | null
  shipped_email_sent_at: string | null
  tracking_number: string | null
  tracking_url: string | null
  carrier: string | null
}

async function sendHtmlEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || "Tetrava Labs <orders@tetravalabs.com>"
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not configured" }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html
    })
  })

  if (!response.ok) {
    return { sent: false, reason: await response.text() }
  }

  return { sent: true }
}

async function loadFulfillmentRow(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<FulfillmentRow>(
        `SELECT * FROM order_fulfillment_emails WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function loadScheduleFallback(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<{
        email: string
        display_id: number | null
        items: OrderEmailItem[]
      }>(
        `SELECT email, display_id, items FROM order_email_schedules WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function loadPaymentIntentEmail(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<{ email: string }>(
        `SELECT email FROM crypto_payment_intents WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0]?.email || null
    },
    async () => null
  )
}

type ScheduleResult = { ok: true } | { ok: false; reason: string }

/** Schedule F2 tracking SLA email when payment completes. */
export async function scheduleTrackingSlaEmail(input: {
  orderId: string
  email: string
  displayId?: number | null
  items?: OrderEmailItem[]
}) {
  return withDb<ScheduleResult>(
    async (db) => {
      await db.query(
        `
        INSERT INTO order_fulfillment_emails (
          order_id,
          email,
          display_id,
          items,
          paid_at,
          tracking_sla_due_at
        )
        VALUES ($1, $2, $3, $4::jsonb, NOW(), NOW() + ($5 || ' hours')::interval)
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_id = COALESCE(EXCLUDED.display_id, order_fulfillment_emails.display_id),
          items = CASE
            WHEN EXCLUDED.items = '[]'::jsonb THEN order_fulfillment_emails.items
            ELSE EXCLUDED.items
          END,
          paid_at = COALESCE(order_fulfillment_emails.paid_at, EXCLUDED.paid_at),
          tracking_sla_due_at = COALESCE(order_fulfillment_emails.tracking_sla_due_at, EXCLUDED.tracking_sla_due_at),
          updated_at = NOW()
      `,
        [
          input.orderId,
          input.email,
          input.displayId ?? null,
          JSON.stringify(input.items || []),
          String(TRACKING_SLA_HOURS)
        ]
      )
      return { ok: true }
    },
    async () => ({ ok: false, reason: "database unavailable" })
  )
}

/**
 * F1 — record shipment + send tracking email (idempotent).
 * Cancels pending F2 SLA email for the order.
 */
export async function recordOrderShipmentAndNotify(input: {
  orderId: string
  trackingNumber: string
  trackingUrl?: string | null
  carrier?: string | null
  email?: string | null
  displayId?: number | null
  items?: OrderEmailItem[]
}) {
  const trackingNumber = input.trackingNumber.trim()
  if (!trackingNumber) {
    return { ok: false as const, reason: "tracking_number is required" }
  }

  let row = await loadFulfillmentRow(input.orderId)
  const schedule = row ? null : await loadScheduleFallback(input.orderId)
  const intentEmail = row || schedule ? null : await loadPaymentIntentEmail(input.orderId)

  const email = (input.email || row?.email || schedule?.email || intentEmail || "").trim()
  if (!email) {
    return { ok: false as const, reason: "customer email not found for order" }
  }

  const displayId = input.displayId ?? row?.display_id ?? schedule?.display_id ?? null
  const items = normalizeOrderEmailItems(
    input.items?.length ? input.items : row?.items ?? schedule?.items
  )

  await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO order_fulfillment_emails (
          order_id,
          email,
          display_id,
          items,
          paid_at,
          tracking_sla_due_at,
          shipped_at,
          tracking_number,
          tracking_url,
          carrier
        )
        VALUES (
          $1, $2, $3, $4::jsonb, NOW(), NOW() + ($5 || ' hours')::interval,
          NOW(), $6, $7, $8
        )
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_id = COALESCE(EXCLUDED.display_id, order_fulfillment_emails.display_id),
          items = CASE
            WHEN EXCLUDED.items = '[]'::jsonb THEN order_fulfillment_emails.items
            ELSE EXCLUDED.items
          END,
          shipped_at = COALESCE(order_fulfillment_emails.shipped_at, NOW()),
          tracking_number = EXCLUDED.tracking_number,
          tracking_url = EXCLUDED.tracking_url,
          carrier = EXCLUDED.carrier,
          updated_at = NOW()
      `,
        [
          input.orderId,
          email,
          displayId,
          JSON.stringify(items),
          String(TRACKING_SLA_HOURS),
          trackingNumber,
          input.trackingUrl?.trim() || null,
          input.carrier?.trim() || null
        ]
      )
    },
    async () => undefined
  )

  row = await loadFulfillmentRow(input.orderId)
  if (row?.shipped_email_sent_at) {
    return { ok: true as const, emailed: false, reason: "already_sent" as const }
  }

  const orderLabel = orderLabelFrom(displayId, input.orderId)
  const { subject, html } = buildOrderShippedEmail({
    orderLabel,
    trackingNumber,
    trackingUrl: input.trackingUrl,
    carrier: input.carrier,
    items,
    ordersUrl: buildStorefrontOrdersUrl(),
    contactUrl: buildStorefrontContactUrl()
  })

  const result = await sendHtmlEmail({ to: email, subject, html })
  if (!result.sent) {
    return { ok: false as const, reason: result.reason }
  }

  await withDb(
    async (db) => {
      await db.query(
        `
        UPDATE order_fulfillment_emails
        SET shipped_email_sent_at = NOW(), updated_at = NOW()
        WHERE order_id = $1 AND shipped_email_sent_at IS NULL
      `,
        [input.orderId]
      )
    },
    async () => undefined
  )

  return { ok: true as const, emailed: true }
}

export async function processDueTrackingSlaEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<FulfillmentRow>(
        `
        SELECT *
        FROM order_fulfillment_emails
        WHERE tracking_sla_sent_at IS NULL
          AND shipped_email_sent_at IS NULL
          AND tracking_sla_due_at <= NOW()
        ORDER BY tracking_sla_due_at ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    tracking_sla_sent: 0,
    failed: 0
  }

  for (const row of due) {
    const orderLabel = orderLabelFrom(row.display_id, row.order_id)
    const { subject, html } = buildTrackingSlaEmail({
      orderLabel,
      items: normalizeOrderEmailItems(row.items),
      ordersUrl: buildStorefrontOrdersUrl(),
      contactUrl: buildStorefrontContactUrl()
    })

    const result = await sendHtmlEmail({
      to: row.email,
      subject,
      html
    })

    if (!result.sent) {
      summary.failed += 1
      console.warn("[fulfillment-email] tracking SLA failed:", row.order_id, result.reason)
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE order_fulfillment_emails
          SET tracking_sla_sent_at = NOW(), updated_at = NOW()
          WHERE order_id = $1
            AND tracking_sla_sent_at IS NULL
            AND shipped_email_sent_at IS NULL
          RETURNING order_id
        `,
          [row.order_id]
        )
        return update.rowCount && update.rowCount > 0
      },
      async () => false
    )

    if (marked) summary.tracking_sla_sent += 1
  }

  return summary
}
