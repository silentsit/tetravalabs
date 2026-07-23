import { withDb } from "./db"
import {
  buildCoaTrustEmail,
  buildOrderShippedEmail,
  buildProductReviewUrl,
  buildReplenishmentEmail,
  buildReviewRequestEmail,
  buildStorefrontCoaLibraryUrl,
  buildStorefrontContactUrl,
  buildStorefrontOrdersUrl,
  buildStorefrontShopUrl,
  buildTrackingSlaEmail,
  COA_TRUST_DELAY_DAYS,
  firstProductHandle,
  normalizeOrderEmailItems,
  orderLabelFrom,
  REPLENISHMENT_R1_DAYS,
  REPLENISHMENT_R2_DAYS_AFTER_R1,
  REPLENISHMENT_R3_DAYS_AFTER_R2,
  REVIEW_REQUEST_DELAY_DAYS,
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
  review_due_at: string | null
  review_sent_at: string | null
  r1_due_at: string | null
  r1_sent_at: string | null
  r2_due_at: string | null
  r2_sent_at: string | null
  r3_due_at: string | null
  r3_sent_at: string | null
  replenishment_cancelled_at: string | null
  coa_trust_due_at: string | null
  coa_trust_sent_at: string | null
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
    await withDb(
      async (db) => {
        await db.query(
          `
          UPDATE order_fulfillment_emails
          SET
            review_due_at = COALESCE(review_due_at, NOW() + ($2 || ' days')::interval),
            r1_due_at = COALESCE(r1_due_at, NOW() + ($3 || ' days')::interval),
            coa_trust_due_at = COALESCE(coa_trust_due_at, NOW() + ($4 || ' days')::interval),
            updated_at = NOW()
          WHERE order_id = $1
            AND (
              (review_sent_at IS NULL AND review_due_at IS NULL)
              OR (r1_sent_at IS NULL AND r1_due_at IS NULL AND replenishment_cancelled_at IS NULL)
              OR (coa_trust_sent_at IS NULL AND coa_trust_due_at IS NULL)
            )
        `,
          [
            input.orderId,
            String(REVIEW_REQUEST_DELAY_DAYS),
            String(REPLENISHMENT_R1_DAYS),
            String(COA_TRUST_DELAY_DAYS)
          ]
        )
      },
      async () => undefined
    )
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
        SET
          shipped_email_sent_at = NOW(),
          review_due_at = COALESCE(review_due_at, NOW() + ($2 || ' days')::interval),
          r1_due_at = COALESCE(r1_due_at, NOW() + ($3 || ' days')::interval),
          coa_trust_due_at = COALESCE(coa_trust_due_at, NOW() + ($4 || ' days')::interval),
          updated_at = NOW()
        WHERE order_id = $1 AND shipped_email_sent_at IS NULL
      `,
        [
          input.orderId,
          String(REVIEW_REQUEST_DELAY_DAYS),
          String(REPLENISHMENT_R1_DAYS),
          String(COA_TRUST_DELAY_DAYS)
        ]
      )
    },
    async () => undefined
  )

  return { ok: true as const, emailed: true }
}

/** Cancel open R1–R3 for a customer after a new paid order. */
export async function cancelReplenishmentEmailsOnPaidOrder(input: {
  email?: string | null
  excludeOrderId?: string | null
}) {
  const email = input.email?.trim().toLowerCase() || null
  if (!email) return { ok: false as const }

  type CancelResult = { ok: true } | { ok: false }

  return withDb<CancelResult>(
    async (db) => {
      await db.query(
        `
        UPDATE order_fulfillment_emails
        SET replenishment_cancelled_at = NOW(), updated_at = NOW()
        WHERE lower(email) = $1
          AND replenishment_cancelled_at IS NULL
          AND (
            (r1_sent_at IS NULL AND r1_due_at IS NOT NULL)
            OR (r1_sent_at IS NOT NULL AND r2_sent_at IS NULL)
            OR (r2_sent_at IS NOT NULL AND r3_sent_at IS NULL)
          )
          AND ($2::text IS NULL OR order_id <> $2)
      `,
        [email, input.excludeOrderId || null]
      )
      return { ok: true as const }
    },
    async () => ({ ok: false as const })
  )
}

export async function processDueReplenishmentEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<FulfillmentRow & { kind: "r1" | "r2" | "r3" }>(
        `
        SELECT *,
          CASE
            WHEN r1_sent_at IS NULL THEN 'r1'
            WHEN r2_sent_at IS NULL THEN 'r2'
            ELSE 'r3'
          END AS kind
        FROM order_fulfillment_emails
        WHERE replenishment_cancelled_at IS NULL
          AND shipped_email_sent_at IS NOT NULL
          AND (
            (r1_sent_at IS NULL AND r1_due_at IS NOT NULL AND r1_due_at <= NOW())
            OR (
              r1_sent_at IS NOT NULL
              AND r2_sent_at IS NULL
              AND r2_due_at IS NOT NULL
              AND r2_due_at <= NOW()
            )
            OR (
              r2_sent_at IS NOT NULL
              AND r3_sent_at IS NULL
              AND r3_due_at IS NOT NULL
              AND r3_due_at <= NOW()
            )
          )
        ORDER BY COALESCE(r1_due_at, r2_due_at, r3_due_at) ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    r1_sent: 0,
    r2_sent: 0,
    r3_sent: 0,
    failed: 0
  }

  for (const row of due) {
    const step = row.kind === "r1" ? 1 : row.kind === "r2" ? 2 : 3
    const items = normalizeOrderEmailItems(row.items)
    const orderLabel = orderLabelFrom(row.display_id, row.order_id)

    const { subject, html } = buildReplenishmentEmail({
      orderLabel,
      items,
      ordersUrl: buildStorefrontOrdersUrl(),
      shopUrl: buildStorefrontShopUrl(),
      contactUrl: buildStorefrontContactUrl(),
      step
    })

    const result = await sendHtmlEmail({
      to: row.email,
      subject,
      html
    })

    if (!result.sent) {
      summary.failed += 1
      console.warn("[fulfillment-email] replenishment failed:", row.order_id, row.kind, result.reason)
      continue
    }

    if (row.kind === "r1") {
      const marked = await withDb(
        async (db) => {
          const update = await db.query(
            `
            UPDATE order_fulfillment_emails
            SET
              r1_sent_at = NOW(),
              r2_due_at = NOW() + ($2 || ' days')::interval,
              updated_at = NOW()
            WHERE order_id = $1
              AND r1_sent_at IS NULL
              AND replenishment_cancelled_at IS NULL
            RETURNING order_id
          `,
            [row.order_id, String(REPLENISHMENT_R2_DAYS_AFTER_R1)]
          )
          return Boolean(update.rowCount)
        },
        async () => false
      )
      if (marked) summary.r1_sent += 1
      continue
    }

    if (row.kind === "r2") {
      const marked = await withDb(
        async (db) => {
          const update = await db.query(
            `
            UPDATE order_fulfillment_emails
            SET
              r2_sent_at = NOW(),
              r3_due_at = NOW() + ($2 || ' days')::interval,
              updated_at = NOW()
            WHERE order_id = $1
              AND r2_sent_at IS NULL
              AND replenishment_cancelled_at IS NULL
            RETURNING order_id
          `,
            [row.order_id, String(REPLENISHMENT_R3_DAYS_AFTER_R2)]
          )
          return Boolean(update.rowCount)
        },
        async () => false
      )
      if (marked) summary.r2_sent += 1
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE order_fulfillment_emails
          SET r3_sent_at = NOW(), updated_at = NOW()
          WHERE order_id = $1
            AND r3_sent_at IS NULL
            AND replenishment_cancelled_at IS NULL
          RETURNING order_id
        `,
          [row.order_id]
        )
        return Boolean(update.rowCount)
      },
      async () => false
    )
    if (marked) summary.r3_sent += 1
  }

  return summary
}

export async function processDueCoaTrustEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<FulfillmentRow>(
        `
        SELECT *
        FROM order_fulfillment_emails
        WHERE coa_trust_sent_at IS NULL
          AND shipped_email_sent_at IS NOT NULL
          AND coa_trust_due_at IS NOT NULL
          AND coa_trust_due_at <= NOW()
        ORDER BY coa_trust_due_at ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    coa_trust_sent: 0,
    failed: 0
  }

  for (const row of due) {
    const orderLabel = orderLabelFrom(row.display_id, row.order_id)
    const { subject, html } = buildCoaTrustEmail({
      orderLabel,
      items: normalizeOrderEmailItems(row.items),
      coaLibraryUrl: buildStorefrontCoaLibraryUrl(),
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
      console.warn("[fulfillment-email] COA trust failed:", row.order_id, result.reason)
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE order_fulfillment_emails
          SET coa_trust_sent_at = NOW(), updated_at = NOW()
          WHERE order_id = $1 AND coa_trust_sent_at IS NULL
          RETURNING order_id
        `,
          [row.order_id]
        )
        return Boolean(update.rowCount)
      },
      async () => false
    )

    if (marked) summary.coa_trust_sent += 1
  }

  return summary
}

async function customerAlreadyReviewed(email: string, handles: string[]) {
  if (!handles.length) return false

  return withDb(
    async (db) => {
      try {
        const result = await db.query(
          `
          SELECT 1
          FROM product_reviews pr
          INNER JOIN customer c ON c.id = pr.customer_id
          WHERE lower(c.email) = lower($1)
            AND pr.product_handle = ANY($2::text[])
          LIMIT 1
        `,
          [email, handles]
        )
        return Boolean(result.rowCount)
      } catch {
        // customer table shape may differ across Medusa versions — do not block send.
        return false
      }
    },
    async () => false
  )
}

export async function processDueReviewRequestEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<FulfillmentRow>(
        `
        SELECT *
        FROM order_fulfillment_emails
        WHERE review_sent_at IS NULL
          AND shipped_email_sent_at IS NOT NULL
          AND review_due_at IS NOT NULL
          AND review_due_at <= NOW()
        ORDER BY review_due_at ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    review_sent: 0,
    skipped_reviewed: 0,
    failed: 0
  }

  for (const row of due) {
    const items = normalizeOrderEmailItems(row.items)
    const handles = items.map((item) => item.handle).filter((handle): handle is string => Boolean(handle))

    if (await customerAlreadyReviewed(row.email, handles)) {
      await withDb(
        async (db) => {
          await db.query(
            `
            UPDATE order_fulfillment_emails
            SET review_sent_at = NOW(), updated_at = NOW()
            WHERE order_id = $1 AND review_sent_at IS NULL
          `,
            [row.order_id]
          )
        },
        async () => undefined
      )
      summary.skipped_reviewed += 1
      continue
    }

    const handle = firstProductHandle(items)
    const reviewUrl = handle
      ? buildProductReviewUrl(handle)
      : buildStorefrontOrdersUrl()
    const orderLabel = orderLabelFrom(row.display_id, row.order_id)

    const { subject, html } = buildReviewRequestEmail({
      orderLabel,
      items,
      reviewUrl,
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
      console.warn("[fulfillment-email] review request failed:", row.order_id, result.reason)
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE order_fulfillment_emails
          SET review_sent_at = NOW(), updated_at = NOW()
          WHERE order_id = $1 AND review_sent_at IS NULL
          RETURNING order_id
        `,
          [row.order_id]
        )
        return Boolean(update.rowCount)
      },
      async () => false
    )

    if (marked) summary.review_sent += 1
  }

  return summary
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
