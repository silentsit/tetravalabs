import { withDb } from "./db"
import {
  advanceDunningStage,
  billingCycleKeyFromDate,
  claimDueActiveRestock,
  clearRenewalCycleOnPaid,
  getRestockById,
  listRestocksForOrderPaid,
  getUnpaidPaymentIntent,
  listDueActiveRestocks,
  listPastDueForDunning,
  markRestockRenewalPending,
  recordRestockShipment,
  shipmentAlreadyPaid,
  touchDunningEmailSent,
  type LabRestockRow
} from "./lab-restock-db"
import { createPeptidepayCheckoutSession } from "./peptidepay"
import { resolvePeptidepayOnramp, restockShippingCountry } from "./peptidepay-onramps"
import { buildPeptidepayProductName } from "./product-sku"
import { createLabRestockRenewalOrder } from "./lab-restock-order"
import { sendHtmlEmail } from "./order-email-send"
import {
  buildLabRestockPaymentEmail,
  buildPeptideRefillDunningEmail,
  buildStorefrontAccountRestocksUrl
} from "./order-email-templates"

const RESEND_STAGE0_MIN_HOURS = 20

function pendingRenewalAmountUsd(restock: LabRestockRow): number {
  const raw = restock.metadata?.pending_renewal_amount_usd
  if (typeof raw === "number" && Number.isFinite(raw)) return raw
  if (typeof raw === "string") {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) return parsed
  }
  return restock.unit_price_usd * restock.quantity
}

export async function processDueLabRestocks() {
  const due = await withDb(async (db) => listDueActiveRestocks(db), async () => [])

  const summary = {
    scanned: due.length,
    renewal_orders_created: 0,
    emails_sent: 0,
    reused_sessions: 0,
    failed: 0
  }

  for (const restock of due) {
    try {
      const result = await createRenewalCheckoutIdempotent(restock.id)
      if (!result.ok) {
        summary.failed += 1
        console.warn("[lab-restock] renewal failed:", restock.id, result.reason)
        continue
      }
      if (result.reused) summary.reused_sessions += 1
      else summary.renewal_orders_created += 1
      if (result.emailed) summary.emails_sent += 1
    } catch (error) {
      summary.failed += 1
      console.warn("[lab-restock] renewal error:", restock.id, error)
    }
  }

  return summary
}

export async function processPeptideRefillDunning() {
  const due = await withDb(async (db) => listPastDueForDunning(db), async () => [])

  const summary = {
    scanned: due.length,
    reminder_sent: 0,
    final_sent: 0,
    paused: 0,
    failed: 0
  }

  for (const restock of due) {
    try {
      const stage = restock.dunning_stage
      const paymentUrl =
        typeof restock.metadata?.pending_payment_url === "string"
          ? restock.metadata.pending_payment_url
          : null
      const amountUsd = pendingRenewalAmountUsd(restock)

      if (!paymentUrl) {
        await withDb(
          async (db) =>
            advanceDunningStage(db, {
              restockId: restock.id,
              nextStage: 3,
              nextDueAt: null,
              pause: true
            }),
          async () => undefined
        )
        summary.paused += 1
        continue
      }

      // stage 0 + dunning_due_at → Day 3 reminder
      if (stage <= 0) {
        const nextDue = new Date()
        nextDue.setDate(nextDue.getDate() + 4) // day 7
        const { subject, html } = buildPeptideRefillDunningEmail({
          stage: 1,
          title: restock.title,
          variantTitle: restock.variant_title,
          cadenceDays: restock.cadence_days,
          amountUsd,
          paymentUrl,
          accountUrl: buildStorefrontAccountRestocksUrl()
        })
        const emailed = await sendHtmlEmail({ to: restock.email, subject, html })
        if (!emailed.sent) {
          summary.failed += 1
          continue
        }
        await withDb(
          async (db) =>
            advanceDunningStage(db, {
              restockId: restock.id,
              nextStage: 1,
              nextDueAt: nextDue
            }),
          async () => undefined
        )
        summary.reminder_sent += 1
        continue
      }

      // stage 1 → Day 7 final notice
      if (stage === 1) {
        const nextDue = new Date()
        nextDue.setDate(nextDue.getDate() + 1) // day 8
        const { subject, html } = buildPeptideRefillDunningEmail({
          stage: 2,
          title: restock.title,
          variantTitle: restock.variant_title,
          cadenceDays: restock.cadence_days,
          amountUsd,
          paymentUrl,
          accountUrl: buildStorefrontAccountRestocksUrl()
        })
        const emailed = await sendHtmlEmail({ to: restock.email, subject, html })
        if (!emailed.sent) {
          summary.failed += 1
          continue
        }
        await withDb(
          async (db) =>
            advanceDunningStage(db, {
              restockId: restock.id,
              nextStage: 2,
              nextDueAt: nextDue
            }),
          async () => undefined
        )
        summary.final_sent += 1
        continue
      }

      // stage >= 2 → Day 8 pause
      const { subject, html } = buildPeptideRefillDunningEmail({
        stage: 3,
        title: restock.title,
        variantTitle: restock.variant_title,
        cadenceDays: restock.cadence_days,
        amountUsd,
        paymentUrl,
        accountUrl: buildStorefrontAccountRestocksUrl()
      })
      const emailed = await sendHtmlEmail({ to: restock.email, subject, html })
      if (!emailed.sent) {
        summary.failed += 1
        continue
      }
      await withDb(
        async (db) =>
          advanceDunningStage(db, {
            restockId: restock.id,
            nextStage: 3,
            nextDueAt: null,
            pause: true
          }),
        async () => undefined
      )
      summary.paused += 1
    } catch (error) {
      summary.failed += 1
      console.warn("[lab-restock] dunning error:", restock.id, error)
    }
  }

  return summary
}

async function createRenewalCheckoutIdempotent(
  restockId: string
): Promise<
  | { ok: true; emailed: boolean; reused: boolean; paymentUrl: string; orderId: string }
  | { ok: false; reason: string }
> {
  const existing = await withDb(async (db) => getRestockById(db, restockId), async () => null)
  if (!existing) return { ok: false, reason: "Restock not found" }

  const pendingOrderId =
    typeof existing.metadata?.pending_renewal_order_id === "string"
      ? existing.metadata.pending_renewal_order_id
      : null
  const pendingUrl =
    typeof existing.metadata?.pending_payment_url === "string"
      ? existing.metadata.pending_payment_url
      : null

  if (pendingOrderId && pendingUrl) {
    const intent = await withDb(
      async (db) => getUnpaidPaymentIntent(db, pendingOrderId),
      async () => null
    )
    if (intent && intent.status !== "completed" && intent.provider_url) {
      const emailed = await maybeResendStage0(existing, intent.provider_url)
      return {
        ok: true,
        emailed,
        reused: true,
        paymentUrl: intent.provider_url,
        orderId: pendingOrderId
      }
    }
  }

  const claimed = await withDb(
    async (db) => claimDueActiveRestock(db, restockId),
    async () => null
  )
  if (!claimed) {
    const again = await withDb(async (db) => getRestockById(db, restockId), async () => null)
    const orderId =
      typeof again?.metadata?.pending_renewal_order_id === "string"
        ? again.metadata.pending_renewal_order_id
        : null
    const url =
      typeof again?.metadata?.pending_payment_url === "string"
        ? again.metadata.pending_payment_url
        : null
    if (orderId && url) {
      return { ok: true, emailed: false, reused: true, paymentUrl: url, orderId }
    }
    return { ok: false, reason: "Could not claim restock for renewal" }
  }

  return createNewRenewalCheckout(claimed)
}

async function rollbackFailedClaim(restockId: string) {
  await withDb(
    async (db) => {
      await db.query(
        `
        UPDATE lab_restocks
        SET status = 'active', billing_cycle_key = NULL, dunning_stage = 0,
            dunning_due_at = NULL, updated_at = NOW()
        WHERE id = $1 AND status = 'past_due'
          AND (metadata->>'pending_renewal_order_id') IS NULL
        `,
        [restockId]
      )
    },
    async () => undefined
  )
}

async function createNewRenewalCheckout(
  restock: LabRestockRow
): Promise<
  | { ok: true; emailed: boolean; reused: boolean; paymentUrl: string; orderId: string }
  | { ok: false; reason: string }
> {
  const lineTotal = restock.unit_price_usd * restock.quantity
  const cycleKey = restock.billing_cycle_key || billingCycleKeyFromDate()

  const orderResult = await createLabRestockRenewalOrder(restock)
  if (!orderResult.ok) {
    await rollbackFailedClaim(restock.id)
    return orderResult
  }

  const productName = buildPeptidepayProductName([
    {
      handle: restock.handle,
      variantTitle: restock.variant_title || undefined
    }
  ])

  const payOnramp = resolvePeptidepayOnramp({
    country: restockShippingCountry(restock.shipping_address),
    amountUsd: lineTotal
  })
  if (!payOnramp.ok) {
    await rollbackFailedClaim(restock.id)
    return { ok: false, reason: payOnramp.error }
  }

  const paySession = await createPeptidepayCheckoutSession({
    orderId: orderResult.orderId,
    email: restock.email,
    amountUsd: lineTotal,
    productName,
    provider: payOnramp.provider
  })

  if (!paySession.ok) {
    await rollbackFailedClaim(restock.id)
    return { ok: false, reason: paySession.error }
  }

  const persisted = await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO crypto_payment_intents (
          order_id, email, amount_usd, currency, provider_url, provider_payment_id, provider, status
        )
        VALUES ($1,$2,$3,$4,$5,$6,'peptidepay','pending')
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          amount_usd = EXCLUDED.amount_usd,
          currency = EXCLUDED.currency,
          provider_url = EXCLUDED.provider_url,
          provider_payment_id = EXCLUDED.provider_payment_id,
          provider = 'peptidepay',
          status = 'pending'
        `,
        [
          orderResult.orderId,
          restock.email,
          lineTotal,
          "USD",
          paySession.session.url,
          paySession.session.id
        ]
      )
      await markRestockRenewalPending(db, {
        restockId: restock.id,
        renewalOrderId: orderResult.orderId,
        paymentUrl: paySession.session.url,
        amountUsd: lineTotal,
        billingCycleKey: cycleKey
      })
      await recordRestockShipment(db, {
        labRestockId: restock.id,
        orderId: orderResult.orderId,
        amountUsd: lineTotal,
        status: "pending"
      })
      return true
    },
    async () => false
  )

  if (!persisted) {
    await rollbackFailedClaim(restock.id)
    return { ok: false, reason: "Failed to persist renewal checkout" }
  }

  const { subject, html } = buildLabRestockPaymentEmail({
    title: restock.title,
    variantTitle: restock.variant_title,
    cadenceDays: restock.cadence_days,
    amountUsd: lineTotal,
    paymentUrl: paySession.session.url,
    accountUrl: buildStorefrontAccountRestocksUrl()
  })

  const emailResult = await sendHtmlEmail({
    to: restock.email,
    subject,
    html
  })

  return {
    ok: true,
    emailed: emailResult.sent,
    reused: false,
    paymentUrl: paySession.session.url,
    orderId: orderResult.orderId
  }
}

async function maybeResendStage0(restock: LabRestockRow, paymentUrl: string): Promise<boolean> {
  const last = restock.last_dunning_email_at
    ? new Date(restock.last_dunning_email_at).getTime()
    : 0
  const hoursSince = (Date.now() - last) / (1000 * 60 * 60)
  if (last && hoursSince < RESEND_STAGE0_MIN_HOURS) return false

  const amountUsd = pendingRenewalAmountUsd(restock)

  const { subject, html } = buildLabRestockPaymentEmail({
    title: restock.title,
    variantTitle: restock.variant_title,
    cadenceDays: restock.cadence_days,
    amountUsd,
    paymentUrl,
    accountUrl: buildStorefrontAccountRestocksUrl()
  })
  const result = await sendHtmlEmail({ to: restock.email, subject, html })
  if (result.sent) {
    await withDb(async (db) => touchDunningEmailSent(db, restock.id), async () => undefined)
  }
  return result.sent
}

export async function handleLabRestockOrderPaid(orderId: string) {
  await withDb(
    async (db) => {
      const restocks = await listRestocksForOrderPaid(db, orderId)

      for (const restock of restocks) {
        const restockId = restock.id
        if (await shipmentAlreadyPaid(db, restockId, orderId)) continue

        const cadenceDays = restock.cadence_days || 60
        const advanced = await clearRenewalCycleOnPaid(db, {
          restockId,
          orderId,
          cadenceDays
        })

        if (advanced) {
          await recordRestockShipment(db, {
            labRestockId: restockId,
            orderId,
            amountUsd: null,
            status: "paid"
          })
          continue
        }

        // Heal partial webhook: cycle cleared earlier but shipment row missing
        const current = await getRestockById(db, restockId)
        const pendingOrderId =
          typeof current?.metadata?.pending_renewal_order_id === "string"
            ? current.metadata.pending_renewal_order_id
            : null
        if (
          current &&
          current.status === "active" &&
          current.latest_order_id === orderId &&
          !pendingOrderId
        ) {
          await recordRestockShipment(db, {
            labRestockId: restockId,
            orderId,
            amountUsd: null,
            status: "paid"
          })
        }
      }
    },
    async () => undefined
  )
}

export async function createManualRenewalCheckout(restockId: string) {
  const restock = await withDb(async (db) => getRestockById(db, restockId), async () => null)
  if (!restock) return { ok: false as const, message: "Restock not found" }
  if (
    restock.status !== "active" &&
    restock.status !== "past_due" &&
    restock.status !== "paused"
  ) {
    return { ok: false as const, message: "Restock is not due for payment" }
  }

  const pendingOrderId =
    typeof restock.metadata?.pending_renewal_order_id === "string"
      ? restock.metadata.pending_renewal_order_id
      : null
  const pendingUrl =
    typeof restock.metadata?.pending_payment_url === "string"
      ? restock.metadata.pending_payment_url
      : null

  if (pendingOrderId && pendingUrl) {
    const intent = await withDb(
      async (db) => getUnpaidPaymentIntent(db, pendingOrderId),
      async () => null
    )
    if (intent && intent.status !== "completed") {
      return { ok: true as const, payment_url: pendingUrl, order_id: pendingOrderId }
    }
  }

  await withDb(
    async (db) => {
      await db.query(
        `
        UPDATE lab_restocks
        SET
          status = 'active',
          next_billing_at = NOW(),
          dunning_stage = 0,
          dunning_due_at = NULL,
          billing_cycle_key = NULL,
          metadata = metadata
            - 'pending_renewal_order_id'
            - 'pending_payment_url'
            - 'pending_renewal_amount_usd'
            - 'pending_renewal_created_at',
          updated_at = NOW()
        WHERE id = $1
        `,
        [restockId]
      )
    },
    async () => undefined
  )

  const result = await createRenewalCheckoutIdempotent(restockId)
  if (!result.ok) return { ok: false as const, message: result.reason }

  return {
    ok: true as const,
    payment_url: result.paymentUrl,
    order_id: result.orderId
  }
}
