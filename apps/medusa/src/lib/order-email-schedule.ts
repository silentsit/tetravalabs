import { withDb } from "./db"
import { processDueCheckoutAbandonEmails } from "./checkout-abandon"
import { cancelCustomerLifecycleOnPaidOrder, processDueCustomerLifecycleEmails } from "./customer-lifecycle-emails"
import {
  cancelReplenishmentEmailsOnPaidOrder,
  processDueCoaTrustEmails,
  processDueReplenishmentEmails,
  processDueReviewRequestEmails,
  processDueTrackingSlaEmails,
  scheduleTrackingSlaEmail
} from "./order-fulfillment-emails"
import {
  buildPaidOrderConfirmationEmail,
  buildPaymentFollowupEmail,
  buildPaymentReminderEmail,
  buildStorefrontContactUrl,
  buildStorefrontOrdersUrl,
  buildPaymentPageUrl,
  isLivePaymentUrl,
  normalizeOrderEmailItems,
  orderLabelFrom,
  PAYMENT_REMINDER_DELAY_MINUTES,
  PAYMENT_FOLLOWUP_DELAY_MINUTES,
  type OrderEmailItem,
  type PaymentMethod
} from "./order-email-templates"

type ScheduleInput = {
  orderId: string
  email: string
  displayId?: number
  totalUsd: number
  paymentMethod: PaymentMethod
  items: OrderEmailItem[]
}

type ScheduleRow = {
  order_id: string
  email: string
  display_id: number | null
  total_usd: string
  payment_method: PaymentMethod
  items: OrderEmailItem[]
  confirmation_sent_at: string | null
  followup_sent_at: string | null
  cancelled_at: string | null
}

type PaymentIntentRow = {
  provider_url: string
  status: string
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

function orderLabelFor(row: ScheduleRow) {
  return orderLabelFrom(row.display_id, row.order_id)
}

async function loadPaymentIntent(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<PaymentIntentRow>(
        `SELECT provider_url, status FROM crypto_payment_intents WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

type ScheduleResult = { ok: true } | { ok: false; reason: string }
type CancelResult = { ok: true } | { ok: false }

export async function scheduleOrderEmails(input: ScheduleInput) {
  return withDb<ScheduleResult>(
    async (db) => {
      await db.query(
        `
        INSERT INTO order_email_schedules (
          order_id,
          email,
          display_id,
          total_usd,
          payment_method,
          items,
          checkout_at,
          confirmation_due_at
        )
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW(), NOW() + ($7 || ' minutes')::interval)
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_id = EXCLUDED.display_id,
          total_usd = EXCLUDED.total_usd,
          payment_method = EXCLUDED.payment_method,
          items = EXCLUDED.items,
          checkout_at = EXCLUDED.checkout_at,
          confirmation_due_at = EXCLUDED.confirmation_due_at,
          confirmation_sent_at = NULL,
          followup_due_at = NULL,
          followup_sent_at = NULL,
          cancelled_at = NULL,
          updated_at = NOW()
      `,
        [
          input.orderId,
          input.email,
          input.displayId ?? null,
          input.totalUsd,
          input.paymentMethod,
          JSON.stringify(input.items),
          String(PAYMENT_REMINDER_DELAY_MINUTES)
        ]
      )

      return { ok: true }
    },
    async () => ({ ok: false, reason: "database unavailable" })
  )
}

export async function cancelOrderEmailSchedule(orderId: string) {
  return withDb<CancelResult>(
    async (db) => {
      await db.query(
        `
        UPDATE order_email_schedules
        SET cancelled_at = NOW(), updated_at = NOW()
        WHERE order_id = $1 AND cancelled_at IS NULL
      `,
        [orderId]
      )
      return { ok: true }
    },
    async () => ({ ok: false })
  )
}

async function markConfirmationSent(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<ScheduleRow>(
        `
        UPDATE order_email_schedules
        SET
          confirmation_sent_at = NOW(),
          followup_due_at = NOW() + ($2 || ' minutes')::interval,
          updated_at = NOW()
        WHERE order_id = $1
          AND confirmation_sent_at IS NULL
          AND cancelled_at IS NULL
        RETURNING *
      `,
        [orderId, String(PAYMENT_FOLLOWUP_DELAY_MINUTES)]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function markFollowupSent(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<ScheduleRow>(
        `
        UPDATE order_email_schedules
        SET followup_sent_at = NOW(), updated_at = NOW()
        WHERE order_id = $1
          AND confirmation_sent_at IS NOT NULL
          AND followup_sent_at IS NULL
          AND cancelled_at IS NULL
        RETURNING *
      `,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function loadScheduleRow(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<ScheduleRow>(
        `SELECT * FROM order_email_schedules WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

async function listDueSchedules(limit = 50) {
  return withDb(
    async (db) => {
      const result = await db.query<{ order_id: string; kind: "reminder" | "followup" }>(
        `
        SELECT s.order_id,
          CASE
            WHEN s.confirmation_sent_at IS NULL THEN 'reminder'
            ELSE 'followup'
          END AS kind
        FROM order_email_schedules s
        LEFT JOIN crypto_payment_intents p ON p.order_id = s.order_id
        WHERE s.cancelled_at IS NULL
          AND COALESCE(p.status, 'pending') <> 'completed'
          AND (
            (s.confirmation_sent_at IS NULL AND s.confirmation_due_at <= NOW())
            OR (
              s.confirmation_sent_at IS NOT NULL
              AND s.followup_sent_at IS NULL
              AND s.followup_due_at IS NOT NULL
              AND s.followup_due_at <= NOW()
            )
          )
        ORDER BY s.confirmation_due_at ASC
        LIMIT $1
      `,
        [limit]
      )
      return result.rows
    },
    async () => []
  )
}

async function sendScheduledEmail(
  row: ScheduleRow,
  kind: "reminder" | "followup",
  paymentUrl: string
) {
  const orderLabel = orderLabelFor(row)
  const total = Number(row.total_usd)
  const paymentPageUrl = buildPaymentPageUrl(row.order_id, row.display_id, total)
  const items = normalizeOrderEmailItems(row.items)

  const email =
    kind === "reminder"
      ? buildPaymentReminderEmail({
          orderLabel,
          total,
          paymentUrl,
          paymentPageUrl,
          paymentMethod: row.payment_method,
          items
        })
      : buildPaymentFollowupEmail({
          orderLabel,
          total,
          paymentUrl,
          paymentPageUrl,
          paymentMethod: row.payment_method,
          items
        })

  return sendHtmlEmail({
    to: row.email,
    subject: email.subject,
    html: email.html
  })
}

/**
 * Immediate post-payment order confirmation (also acts as payment confirmation).
 * Cancels any pending unpaid reminder / follow-up emails for the order.
 */
export async function sendPaidOrderConfirmationEmail(input: {
  orderId: string
  email: string
  amountUsd: number
}) {
  const schedule = await loadScheduleRow(input.orderId)
  const orderLabel = schedule
    ? orderLabelFor(schedule)
    : input.orderId
  const total = schedule ? Number(schedule.total_usd) : input.amountUsd
  const items = normalizeOrderEmailItems(schedule?.items)

  const { subject, html } = buildPaidOrderConfirmationEmail({
    orderLabel,
    total,
    items,
    ordersUrl: buildStorefrontOrdersUrl(),
    contactUrl: buildStorefrontContactUrl()
  })

  const result = await sendHtmlEmail({
    to: input.email,
    subject,
    html
  })

  await cancelOrderEmailSchedule(input.orderId)
  await scheduleTrackingSlaEmail({
    orderId: input.orderId,
    email: input.email,
    displayId: schedule?.display_id,
    items
  })
  await cancelCustomerLifecycleOnPaidOrder({ email: input.email })
  await cancelReplenishmentEmailsOnPaidOrder({
    email: input.email,
    excludeOrderId: input.orderId
  })
  return result
}

export async function processDueOrderEmails() {
  const due = await listDueSchedules()
  const summary = {
    scanned: due.length,
    reminder_sent: 0,
    followup_sent: 0,
    skipped_paid: 0,
    skipped_no_payment_url: 0,
    failed: 0,
    tracking_sla_sent: 0,
    tracking_sla_failed: 0
  }

  for (const entry of due) {
    const intent = await loadPaymentIntent(entry.order_id)
    if (intent?.status === "completed") {
      await cancelOrderEmailSchedule(entry.order_id)
      summary.skipped_paid += 1
      continue
    }

    if (!isLivePaymentUrl(intent?.provider_url)) {
      summary.skipped_no_payment_url += 1
      continue
    }

    const paymentUrl = intent!.provider_url

    if (entry.kind === "reminder") {
      const row = await loadScheduleRow(entry.order_id)
      if (!row || row.confirmation_sent_at || row.cancelled_at) continue

      const result = await sendScheduledEmail(row, "reminder", paymentUrl)
      if (!result.sent) {
        summary.failed += 1
        console.warn("[order-email] payment reminder failed:", entry.order_id, result.reason)
        continue
      }

      const marked = await markConfirmationSent(entry.order_id)
      if (marked) summary.reminder_sent += 1
      continue
    }

    const row = await loadScheduleRow(entry.order_id)
    if (!row || !row.confirmation_sent_at || row.followup_sent_at || row.cancelled_at) continue

    const result = await sendScheduledEmail(row, "followup", paymentUrl)
    if (!result.sent) {
      summary.failed += 1
      console.warn("[order-email] follow-up failed:", entry.order_id, result.reason)
      continue
    }

    const marked = await markFollowupSent(entry.order_id)
    if (marked) summary.followup_sent += 1
  }

  const sla = await processDueTrackingSlaEmails()
  summary.tracking_sla_sent = sla.tracking_sla_sent
  summary.tracking_sla_failed = sla.failed

  const review = await processDueReviewRequestEmails()
  const abandon = await processDueCheckoutAbandonEmails()
  const lifecycle = await processDueCustomerLifecycleEmails()
  const replenishment = await processDueReplenishmentEmails()
  const coaTrust = await processDueCoaTrustEmails()
  return {
    ...summary,
    review_scanned: review.scanned,
    review_sent: review.review_sent,
    review_skipped: review.skipped_reviewed,
    review_failed: review.failed,
    checkout_abandon_scanned: abandon.scanned,
    checkout_abandon_reminder_sent: abandon.reminder_sent,
    checkout_abandon_followup_sent: abandon.followup_sent,
    checkout_abandon_final_sent: abandon.final_sent,
    checkout_abandon_failed: abandon.failed,
    lifecycle_scanned: lifecycle.scanned,
    lifecycle_welcome_1_sent: lifecycle.welcome_1_sent,
    lifecycle_welcome_2_sent: lifecycle.welcome_2_sent,
    lifecycle_winback_1_sent: lifecycle.winback_1_sent,
    lifecycle_skipped_ordered: lifecycle.skipped_ordered,
    lifecycle_failed: lifecycle.failed,
    replenishment_scanned: replenishment.scanned,
    replenishment_r1_sent: replenishment.r1_sent,
    replenishment_r2_sent: replenishment.r2_sent,
    replenishment_r3_sent: replenishment.r3_sent,
    replenishment_failed: replenishment.failed,
    coa_trust_scanned: coaTrust.scanned,
    coa_trust_sent: coaTrust.coa_trust_sent,
    coa_trust_failed: coaTrust.failed
  }
}
