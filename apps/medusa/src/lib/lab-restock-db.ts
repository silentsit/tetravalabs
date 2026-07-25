import type { Pool } from "pg"
import {
  LAB_RESTOCK_DISCOUNT_PCT,
  newLabRestockId,
  newLabRestockShipmentId,
  type LabRestockCadenceDays,
  type RestockCheckoutItem
} from "./lab-restock"

export type LabRestockRow = {
  id: string
  customer_id: string | null
  email: string
  status: string
  product_id: string | null
  variant_id: string
  handle: string
  title: string
  variant_title: string | null
  quantity: number
  unit_price_usd: number
  one_time_unit_price_usd: number
  cadence_days: number
  discount_pct: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_checkout_session_id: string | null
  latest_order_id: string | null
  next_billing_at: string | null
  paused_at: string | null
  cancelled_at: string | null
  dunning_stage: number
  dunning_due_at: string | null
  last_dunning_email_at: string | null
  billing_cycle_key: string | null
  shipping_address: Record<string, unknown> | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export function billingCycleKeyFromDate(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export async function insertPendingRestocks(
  db: Pool,
  input: {
    orderId: string
    email: string
    customerId?: string | null
    shippingAddress?: Record<string, unknown>
    items: RestockCheckoutItem[]
  }
): Promise<string[]> {
  const ids: string[] = []
  for (const item of input.items) {
    const id = newLabRestockId()
    ids.push(id)
    await db.query(
      `
      INSERT INTO lab_restocks (
        id, customer_id, email, status, product_id, variant_id, handle, title, variant_title,
        quantity, unit_price_usd, one_time_unit_price_usd, cadence_days, discount_pct,
        latest_order_id, shipping_address, metadata
      ) VALUES (
        $1,$2,$3,'pending',$4,$5,$6,$7,$8,
        $9,$10,$11,$12,$13,
        $14,$15::jsonb,$16::jsonb
      )
      `,
      [
        id,
        input.customerId || null,
        input.email,
        item.productId || null,
        item.variantId,
        item.handle,
        item.title,
        item.variantTitle || null,
        item.quantity,
        item.unitPrice,
        item.oneTimeUnitPrice ?? item.unitPrice,
        item.cadenceDays,
        LAB_RESTOCK_DISCOUNT_PCT,
        input.orderId,
        JSON.stringify(input.shippingAddress || {}),
        JSON.stringify({ source_order_id: input.orderId })
      ]
    )
  }
  return ids
}

export async function listDueActiveRestocks(db: Pool): Promise<LabRestockRow[]> {
  const result = await db.query(
    `
    SELECT *
    FROM lab_restocks
    WHERE status = 'active'
      AND next_billing_at IS NOT NULL
      AND next_billing_at <= NOW()
      AND (metadata->>'pending_renewal_order_id') IS NULL
    ORDER BY next_billing_at ASC
    LIMIT 25
    `
  )
  return result.rows.map(mapRow)
}

/** Atomically claim an active due restock so concurrent cron runs cannot double-create. */
export async function claimDueActiveRestock(
  db: Pool,
  restockId: string
): Promise<LabRestockRow | null> {
  const cycleKey = billingCycleKeyFromDate()
  const result = await db.query(
    `
    UPDATE lab_restocks
    SET
      status = 'past_due',
      billing_cycle_key = $2,
      dunning_stage = 0,
      updated_at = NOW()
    WHERE id = $1
      AND status = 'active'
      AND next_billing_at IS NOT NULL
      AND next_billing_at <= NOW()
      AND (metadata->>'pending_renewal_order_id') IS NULL
    RETURNING *
    `,
    [restockId, cycleKey]
  )
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

export async function markRestockRenewalPending(
  db: Pool,
  input: {
    restockId: string
    renewalOrderId: string
    paymentUrl: string
    amountUsd: number
    billingCycleKey: string
  }
): Promise<void> {
  await db.query(
    `
    UPDATE lab_restocks
    SET
      status = 'past_due',
      billing_cycle_key = $3,
      dunning_stage = 0,
      dunning_due_at = NOW() + interval '3 days',
      last_dunning_email_at = NOW(),
      metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb,
      updated_at = NOW()
    WHERE id = $1
    `,
    [
      input.restockId,
      JSON.stringify({
        pending_renewal_order_id: input.renewalOrderId,
        pending_payment_url: input.paymentUrl,
        pending_renewal_amount_usd: input.amountUsd,
        pending_renewal_created_at: new Date().toISOString()
      }),
      input.billingCycleKey
    ]
  )
}

export async function touchDunningEmailSent(db: Pool, restockId: string): Promise<void> {
  await db.query(
    `
    UPDATE lab_restocks
    SET last_dunning_email_at = NOW(), updated_at = NOW()
    WHERE id = $1
    `,
    [restockId]
  )
}

export async function listPastDueForDunning(db: Pool): Promise<LabRestockRow[]> {
  const result = await db.query(
    `
    SELECT *
    FROM lab_restocks
    WHERE status = 'past_due'
      AND dunning_due_at IS NOT NULL
      AND dunning_due_at <= NOW()
      AND (metadata->>'pending_renewal_order_id') IS NOT NULL
    ORDER BY dunning_due_at ASC
    LIMIT 50
    `
  )
  return result.rows.map(mapRow)
}

export async function advanceDunningStage(
  db: Pool,
  input: {
    restockId: string
    nextStage: number
    nextDueAt: Date | null
    pause?: boolean
  }
): Promise<void> {
  if (input.pause) {
    await db.query(
      `
      UPDATE lab_restocks
      SET
        status = 'paused',
        dunning_stage = $2,
        dunning_due_at = NULL,
        paused_at = NOW(),
        last_dunning_email_at = NOW(),
        metadata = metadata
          - 'pending_renewal_order_id'
          - 'pending_payment_url'
          - 'pending_renewal_amount_usd'
          - 'pending_renewal_created_at',
        updated_at = NOW()
      WHERE id = $1
      `,
      [input.restockId, input.nextStage]
    )
    return
  }

  await db.query(
    `
    UPDATE lab_restocks
    SET
      dunning_stage = $2,
      dunning_due_at = $3,
      last_dunning_email_at = NOW(),
      updated_at = NOW()
    WHERE id = $1
    `,
    [input.restockId, input.nextStage, input.nextDueAt]
  )
}

export async function clearRenewalCycleOnPaid(
  db: Pool,
  input: { restockId: string; orderId: string; cadenceDays: number }
): Promise<boolean> {
  const result = await db.query(
    `
    UPDATE lab_restocks
    SET
      status = 'active',
      latest_order_id = $2,
      next_billing_at = NOW() + ($3 || ' days')::interval,
      dunning_stage = 0,
      dunning_due_at = NULL,
      last_dunning_email_at = NULL,
      billing_cycle_key = NULL,
      paused_at = NULL,
      metadata = metadata
        - 'pending_renewal_order_id'
        - 'pending_payment_url'
        - 'pending_renewal_amount_usd'
        - 'pending_renewal_created_at',
      updated_at = NOW()
    WHERE id = $1
      AND (
        metadata->>'pending_renewal_order_id' = $2
        OR (latest_order_id = $2 AND status = 'pending')
      )
    RETURNING id
    `,
    [input.restockId, input.orderId, String(input.cadenceDays)]
  )
  return Boolean(result.rowCount)
}

export async function listRestocksForOrderPaid(
  db: Pool,
  orderId: string
): Promise<LabRestockRow[]> {
  const result = await db.query(
    `
    SELECT *
    FROM lab_restocks
    WHERE metadata->>'pending_renewal_order_id' = $1
       OR (latest_order_id = $1 AND status = 'pending')
    ORDER BY created_at ASC
    `,
    [orderId]
  )
  return result.rows.map(mapRow)
}

export async function getUnpaidPaymentIntent(
  db: Pool,
  orderId: string
): Promise<{ order_id: string; provider_url: string; status: string } | null> {
  const result = await db.query(
    `
    SELECT order_id, provider_url, status
    FROM crypto_payment_intents
    WHERE order_id = $1
    LIMIT 1
    `,
    [orderId]
  )
  const row = result.rows[0]
  if (!row) return null
  return {
    order_id: String(row.order_id),
    provider_url: String(row.provider_url || ""),
    status: String(row.status || "")
  }
}

export async function shipmentAlreadyPaid(
  db: Pool,
  labRestockId: string,
  orderId: string
): Promise<boolean> {
  const result = await db.query(
    `
    SELECT 1
    FROM lab_restock_shipments
    WHERE lab_restock_id = $1 AND order_id = $2 AND status = 'paid'
    LIMIT 1
    `,
    [labRestockId, orderId]
  )
  return Boolean(result.rows[0])
}

export async function listRestocksForEmail(
  db: Pool,
  email: string,
  customerId?: string | null
): Promise<LabRestockRow[]> {
  const result = await db.query(
    `
    SELECT *
    FROM lab_restocks
    WHERE lower(email) = lower($1)
       OR ($2::text IS NOT NULL AND customer_id = $2)
    ORDER BY created_at DESC
    `,
    [email, customerId || null]
  )
  return result.rows.map(mapRow)
}

export async function getRestockById(db: Pool, id: string): Promise<LabRestockRow | null> {
  const result = await db.query(`SELECT * FROM lab_restocks WHERE id = $1 LIMIT 1`, [id])
  return result.rows[0] ? mapRow(result.rows[0]) : null
}

export async function updateRestockStatus(
  db: Pool,
  id: string,
  status: "active" | "paused" | "cancelled" | "past_due",
  extra?: { nextBillingAt?: Date | null; cadenceDays?: LabRestockCadenceDays }
): Promise<void> {
  await db.query(
    `
    UPDATE lab_restocks
    SET
      status = $2,
      paused_at = CASE WHEN $2 = 'paused' THEN NOW() WHEN $2 = 'active' THEN NULL ELSE paused_at END,
      cancelled_at = CASE WHEN $2 = 'cancelled' THEN NOW() ELSE cancelled_at END,
      next_billing_at = COALESCE($3, next_billing_at),
      cadence_days = COALESCE($4, cadence_days),
      dunning_stage = CASE WHEN $2 = 'active' THEN 0 ELSE dunning_stage END,
      dunning_due_at = CASE WHEN $2 = 'active' THEN NULL ELSE dunning_due_at END,
      updated_at = NOW()
    WHERE id = $1
    `,
    [id, status, extra?.nextBillingAt || null, extra?.cadenceDays ?? null]
  )
}

/** Resume paused refill and invoice on next cron (next_billing_at = now). */
export async function resumeRestockForInvoice(db: Pool, id: string): Promise<void> {
  await db.query(
    `
    UPDATE lab_restocks
    SET
      status = 'active',
      paused_at = NULL,
      cancelled_at = NULL,
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
    [id]
  )
}

export async function recordRestockShipment(
  db: Pool,
  input: {
    labRestockId: string
    orderId?: string | null
    amountUsd?: number | null
    status: "pending" | "paid" | "failed" | "skipped"
  }
): Promise<void> {
  await db.query(
    `
    INSERT INTO lab_restock_shipments (
      id, lab_restock_id, order_id, amount_usd, status
    ) VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (lab_restock_id, order_id) WHERE (order_id IS NOT NULL)
    DO UPDATE SET
      status = EXCLUDED.status,
      amount_usd = COALESCE(EXCLUDED.amount_usd, lab_restock_shipments.amount_usd)
    `,
    [
      newLabRestockShipmentId(),
      input.labRestockId,
      input.orderId || null,
      input.amountUsd ?? null,
      input.status
    ]
  )
}

export async function hasActiveRestockForHandle(
  db: Pool,
  email: string,
  handle: string
): Promise<boolean> {
  const result = await db.query(
    `
    SELECT 1
    FROM lab_restocks
    WHERE lower(email) = lower($1)
      AND handle = $2
      AND status IN ('active', 'paused', 'past_due', 'pending')
    LIMIT 1
    `,
    [email, handle]
  )
  return Boolean(result.rows[0])
}

function mapRow(row: Record<string, unknown>): LabRestockRow {
  return {
    id: String(row.id),
    customer_id: (row.customer_id as string) || null,
    email: String(row.email),
    status: String(row.status),
    product_id: (row.product_id as string) || null,
    variant_id: String(row.variant_id),
    handle: String(row.handle),
    title: String(row.title),
    variant_title: (row.variant_title as string) || null,
    quantity: Number(row.quantity),
    unit_price_usd: Number(row.unit_price_usd),
    one_time_unit_price_usd: Number(row.one_time_unit_price_usd),
    cadence_days: Number(row.cadence_days),
    discount_pct: Number(row.discount_pct),
    stripe_customer_id: (row.stripe_customer_id as string) || null,
    stripe_subscription_id: (row.stripe_subscription_id as string) || null,
    stripe_checkout_session_id: (row.stripe_checkout_session_id as string) || null,
    latest_order_id: (row.latest_order_id as string) || null,
    next_billing_at: row.next_billing_at ? String(row.next_billing_at) : null,
    paused_at: row.paused_at ? String(row.paused_at) : null,
    cancelled_at: row.cancelled_at ? String(row.cancelled_at) : null,
    dunning_stage: Number(row.dunning_stage ?? 0),
    dunning_due_at: row.dunning_due_at ? String(row.dunning_due_at) : null,
    last_dunning_email_at: row.last_dunning_email_at
      ? String(row.last_dunning_email_at)
      : null,
    billing_cycle_key: (row.billing_cycle_key as string) || null,
    shipping_address: (row.shipping_address as Record<string, unknown>) || null,
    metadata: (row.metadata as Record<string, unknown>) || {},
    created_at: String(row.created_at),
    updated_at: String(row.updated_at)
  }
}
