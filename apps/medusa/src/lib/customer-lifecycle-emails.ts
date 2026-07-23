import { withDb } from "./db"
import {
  buildStorefrontBlogUrl,
  buildStorefrontContactUrl,
  buildStorefrontShopUrl,
  buildWelcomeEmail,
  buildWelcomeFollowupEmail,
  buildWinbackEmail,
  WELCOME_FOLLOWUP_DAYS,
  WINBACK_DELAY_DAYS,
  type LifecycleEmailKind
} from "./order-email-templates"

type LifecycleRow = {
  id: string
  customer_id: string
  email: string
  kind: LifecycleEmailKind
  due_at: string
  sent_at: string | null
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

async function customerHasPaidOrder(customerId: string) {
  return withDb(
    async (db) => {
      const result = await db.query(
        `
        SELECT 1
        FROM "order" o
        WHERE o.customer_id = $1
          AND o.deleted_at IS NULL
          AND lower(COALESCE(o.status, '')) NOT IN ('canceled', 'cancelled', 'draft')
        LIMIT 1
      `,
        [customerId]
      )
      return Boolean(result.rowCount)
    },
    async () => false
  )
}

async function loadCustomerProfile(customerId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<{
        id: string
        email: string
        first_name: string | null
      }>(
        `
        SELECT id, email, first_name
        FROM customer
        WHERE id = $1 AND deleted_at IS NULL
        LIMIT 1
      `,
        [customerId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

type ScheduleResult =
  | { ok: true }
  | { ok: false; reason: string }
  | { ok: true; skipped: "already_ordered" }

type CancelResult = { ok: true } | { ok: false }

/**
 * Schedule W1 (now), W2 (+2d), WB1 (+60d) when a customer account is created.
 * Idempotent per (customer_id, kind).
 */
export async function scheduleCustomerLifecycleEmails(input: {
  customerId: string
  email?: string | null
  firstName?: string | null
}) {
  const customerId = input.customerId?.trim()
  if (!customerId) return { ok: false as const, reason: "customer_id required" }

  const profile = await loadCustomerProfile(customerId)
  const email = (input.email || profile?.email || "").trim().toLowerCase()
  if (!email) return { ok: false as const, reason: "customer email not found" }

  if (await customerHasPaidOrder(customerId)) {
    return { ok: true as const, skipped: "already_ordered" as const }
  }

  return withDb<ScheduleResult>(
    async (db) => {
      await db.query(
        `
        INSERT INTO customer_lifecycle_emails (id, customer_id, email, kind, due_at)
        VALUES ($1, $2, $3, 'welcome_1', NOW())
        ON CONFLICT (customer_id, kind) DO NOTHING
      `,
        [`lifecycle_${customerId}_welcome_1`, customerId, email]
      )

      await db.query(
        `
        INSERT INTO customer_lifecycle_emails (id, customer_id, email, kind, due_at)
        VALUES ($1, $2, $3, 'welcome_2', NOW() + ($4 || ' days')::interval)
        ON CONFLICT (customer_id, kind) DO NOTHING
      `,
        [
          `lifecycle_${customerId}_welcome_2`,
          customerId,
          email,
          String(WELCOME_FOLLOWUP_DAYS)
        ]
      )

      await db.query(
        `
        INSERT INTO customer_lifecycle_emails (id, customer_id, email, kind, due_at)
        VALUES ($1, $2, $3, 'winback_1', NOW() + ($4 || ' days')::interval)
        ON CONFLICT (customer_id, kind) DO NOTHING
      `,
        [`lifecycle_${customerId}_winback_1`, customerId, email, String(WINBACK_DELAY_DAYS)]
      )

      return { ok: true as const }
    },
    async () => ({ ok: false as const, reason: "database unavailable" })
  )
}

/** Cancel open welcome_2 / winback rows after first paid order. */
export async function cancelCustomerLifecycleOnPaidOrder(input: {
  customerId?: string | null
  email?: string | null
}) {
  const customerId = input.customerId?.trim() || null
  const email = input.email?.trim().toLowerCase() || null
  if (!customerId && !email) return { ok: false as const }

  return withDb<CancelResult>(
    async (db) => {
      await db.query(
        `
        UPDATE customer_lifecycle_emails
        SET cancelled_at = NOW(), updated_at = NOW()
        WHERE sent_at IS NULL
          AND cancelled_at IS NULL
          AND kind IN ('welcome_1', 'welcome_2', 'winback_1', 'winback_2')
          AND (
            ($1::text IS NOT NULL AND customer_id = $1)
            OR ($2::text IS NOT NULL AND lower(email) = $2)
          )
      `,
        [customerId, email]
      )
      return { ok: true as const }
    },
    async () => ({ ok: false as const })
  )
}

export async function processDueCustomerLifecycleEmails() {
  const due = await withDb(
    async (db) => {
      const result = await db.query<LifecycleRow>(
        `
        SELECT *
        FROM customer_lifecycle_emails
        WHERE sent_at IS NULL
          AND cancelled_at IS NULL
          AND due_at <= NOW()
        ORDER BY due_at ASC
        LIMIT 50
      `
      )
      return result.rows
    },
    async () => []
  )

  const summary = {
    scanned: due.length,
    welcome_1_sent: 0,
    welcome_2_sent: 0,
    winback_1_sent: 0,
    skipped_ordered: 0,
    failed: 0
  }

  for (const row of due) {
    if (await customerHasPaidOrder(row.customer_id)) {
      await cancelCustomerLifecycleOnPaidOrder({
        customerId: row.customer_id,
        email: row.email
      })
      summary.skipped_ordered += 1
      continue
    }

    const profile = await loadCustomerProfile(row.customer_id)
    const firstName = profile?.first_name || null
    const shopUrl = buildStorefrontShopUrl()
    const blogUrl = buildStorefrontBlogUrl()
    const contactUrl = buildStorefrontContactUrl()

    let email:
      | { subject: string; html: string }
      | null = null

    if (row.kind === "welcome_1") {
      email = buildWelcomeEmail({ firstName, shopUrl, blogUrl, contactUrl })
    } else if (row.kind === "welcome_2") {
      email = buildWelcomeFollowupEmail({ firstName, shopUrl, blogUrl, contactUrl })
    } else if (row.kind === "winback_1") {
      email = buildWinbackEmail({ firstName, shopUrl, contactUrl })
    } else {
      // winback_2 deferred
      continue
    }

    const result = await sendHtmlEmail({
      to: row.email,
      subject: email.subject,
      html: email.html
    })

    if (!result.sent) {
      summary.failed += 1
      console.warn("[lifecycle-email] send failed:", row.id, result.reason)
      continue
    }

    const marked = await withDb(
      async (db) => {
        const update = await db.query(
          `
          UPDATE customer_lifecycle_emails
          SET sent_at = NOW(), updated_at = NOW()
          WHERE id = $1 AND sent_at IS NULL AND cancelled_at IS NULL
          RETURNING id
        `,
          [row.id]
        )
        return Boolean(update.rowCount)
      },
      async () => false
    )

    if (!marked) continue

    if (row.kind === "welcome_1") summary.welcome_1_sent += 1
    else if (row.kind === "welcome_2") summary.welcome_2_sent += 1
    else if (row.kind === "winback_1") summary.winback_1_sent += 1
  }

  return summary
}
