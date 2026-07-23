import { withDb } from "./db"
import {
  buildCheckoutAbandonFinalEmail,
  buildCheckoutAbandonFollowupEmail,
  buildCheckoutAbandonReminderEmail,
  buildCheckoutUrl,
  buildStorefrontContactUrl,
  CHECKOUT_ABANDON_FINAL_HOURS,
  CHECKOUT_ABANDON_FOLLOWUP_HOURS,
  CHECKOUT_ABANDON_REMINDER_MINUTES,
  normalizeOrderEmailItems,
  type OrderEmailItem
} from "./order-email-templates"

type AbandonRow = {
  session_id: string
  email: string
  items: OrderEmailItem[]
  subtotal_usd: string
  started_at: string
  reminder_sent_at: string | null
  followup_sent_at: string | null
  final_sent_at: string | null
  cancelled_at: string | null
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

type ScheduleResult = { ok: true } | { ok: false; reason: string }
type CancelResult = { ok: true } | { ok: false }

export async function scheduleCheckoutAbandon(input: {
  sessionId: string
  email: string
  items: OrderEmailItem[]
  subtotalUsd: number
}) {
  const email = input.email.trim().toLowerCase()
  if (!email || !input.sessionId) {
    return { ok: false as const, reason: "session_id and email are required" }
  }

  return withDb<ScheduleResult>(
    async (db) => {
      await db.query(
        `
        INSERT INTO checkout_abandon_schedules (
          session_id,
          email,
          items,
          subtotal_usd,
          started_at,
          reminder_due_at
        )
        VALUES ($1, $2, $3::jsonb, $4, NOW(), NOW() + ($5 || ' minutes')::interval)
        ON CONFLICT (session_id) DO UPDATE SET
          email = EXCLUDED.email,
          items = EXCLUDED.items,
          subtotal_usd = EXCLUDED.subtotal_usd,
          started_at = EXCLUDED.started_at,
          reminder_due_at = EXCLUDED.reminder_due_at,
          reminder_sent_at = NULL,
          followup_due_at = NULL,
          followup_sent_at = NULL,
          final_due_at = NULL,
          final_sent_at = NULL,
          cancelled_at = NULL,
          updated_at = NOW()
      `,
        [
          input.sessionId,
          email,
          JSON.stringify(input.items || []),
          input.subtotalUsd,
          String(CHECKOUT_ABANDON_REMINDER_MINUTES)
        ]
      )
      return { ok: true as const }
    },
    async () => ({ ok: false as const, reason: "database unavailable" })
  )
}

export async function cancelCheckoutAbandon(sessionId: string) {
  if (!sessionId) return { ok: false as const }

  return withDb<CancelResult>(
    async (db) => {
      await db.query(
        `
        UPDATE checkout_abandon_schedules
        SET cancelled_at = NOW(), updated_at = NOW()
        WHERE session_id = $1 AND cancelled_at IS NULL
      `,
        [sessionId]
      )
      return { ok: true as const }
    },
    async () => ({ ok: false as const })
  )
}

export async function processDueCheckoutAbandonEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<{
        session_id: string
        kind: "reminder" | "followup" | "final"
      }>(
        `
        SELECT session_id,
          CASE
            WHEN reminder_sent_at IS NULL THEN 'reminder'
            WHEN followup_sent_at IS NULL THEN 'followup'
            ELSE 'final'
          END AS kind
        FROM checkout_abandon_schedules
        WHERE cancelled_at IS NULL
          AND (
            (reminder_sent_at IS NULL AND reminder_due_at <= NOW())
            OR (
              reminder_sent_at IS NOT NULL
              AND followup_sent_at IS NULL
              AND followup_due_at IS NOT NULL
              AND followup_due_at <= NOW()
            )
            OR (
              followup_sent_at IS NOT NULL
              AND final_sent_at IS NULL
              AND final_due_at IS NOT NULL
              AND final_due_at <= NOW()
            )
          )
        ORDER BY reminder_due_at ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    reminder_sent: 0,
    followup_sent: 0,
    final_sent: 0,
    failed: 0
  }

  for (const entry of due) {
    const row = await withDb(
      async (db) => {
        const result = await db.query<AbandonRow>(
          `SELECT * FROM checkout_abandon_schedules WHERE session_id = $1 LIMIT 1`,
          [entry.session_id]
        )
        return result.rows[0] || null
      },
      async () => null
    )

    if (!row || row.cancelled_at) continue

    const items = normalizeOrderEmailItems(row.items)
    const subtotal = Number(row.subtotal_usd)
    const email =
      entry.kind === "reminder"
        ? buildCheckoutAbandonReminderEmail({
            items,
            subtotal,
            checkoutUrl: buildCheckoutUrl(),
            contactUrl: buildStorefrontContactUrl()
          })
        : entry.kind === "followup"
          ? buildCheckoutAbandonFollowupEmail({
              items,
              subtotal,
              checkoutUrl: buildCheckoutUrl(),
              contactUrl: buildStorefrontContactUrl()
            })
          : buildCheckoutAbandonFinalEmail({
              items,
              subtotal,
              checkoutUrl: buildCheckoutUrl(),
              contactUrl: buildStorefrontContactUrl()
            })

    const result = await sendHtmlEmail({
      to: row.email,
      subject: email.subject,
      html: email.html
    })

    if (!result.sent) {
      summary.failed += 1
      console.warn("[checkout-abandon] send failed:", entry.session_id, result.reason)
      continue
    }

    if (entry.kind === "reminder") {
      const marked = await withDb(
        async (db) => {
          const update = await db.query(
            `
            UPDATE checkout_abandon_schedules
            SET
              reminder_sent_at = NOW(),
              followup_due_at = NOW() + ($2 || ' hours')::interval,
              updated_at = NOW()
            WHERE session_id = $1
              AND reminder_sent_at IS NULL
              AND cancelled_at IS NULL
            RETURNING session_id
          `,
            [entry.session_id, String(CHECKOUT_ABANDON_FOLLOWUP_HOURS)]
          )
          return Boolean(update.rowCount)
        },
        async () => false
      )
      if (marked) summary.reminder_sent += 1
      continue
    }

    if (entry.kind === "followup") {
      const marked = await withDb(
        async (db) => {
          const update = await db.query(
            `
            UPDATE checkout_abandon_schedules
            SET
              followup_sent_at = NOW(),
              final_due_at = started_at + ($2 || ' hours')::interval,
              updated_at = NOW()
            WHERE session_id = $1
              AND followup_sent_at IS NULL
              AND cancelled_at IS NULL
            RETURNING session_id
          `,
            [entry.session_id, String(CHECKOUT_ABANDON_FINAL_HOURS)]
          )
          return Boolean(update.rowCount)
        },
        async () => false
      )
      if (marked) summary.followup_sent += 1
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE checkout_abandon_schedules
          SET final_sent_at = NOW(), updated_at = NOW()
          WHERE session_id = $1
            AND final_sent_at IS NULL
            AND cancelled_at IS NULL
          RETURNING session_id
        `,
          [entry.session_id]
        )
        return Boolean(update.rowCount)
      },
      async () => false
    )
    if (marked) summary.final_sent += 1
  }

  return summary
}
