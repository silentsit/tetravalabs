import type { MedusaContainer } from "@medusajs/framework/types"
import { captureOrderPayment } from "./capture-order-payment"
import { withDb } from "./db"
import {
  EMAIL_BRAND_SHORT,
  MANUAL_CARD_INVOICE_ID,
  MANUAL_CARD_INVOICE_INTERNAL_NOTE,
  MANUAL_CARD_INVOICE_TITLE,
  opsNewOrderEmail
} from "./manual-card-invoice-config"
import { cancelCustomerLifecycleOnPaidOrder } from "./customer-lifecycle-emails"
import { cancelReplenishmentEmailsOnPaidOrder, scheduleTrackingSlaEmail } from "./order-fulfillment-emails"
import { sendHtmlEmail } from "./order-email-send"
import { cancelOrderEmailSchedule } from "./order-email-schedule"
import {
  buildInvoiceOrderReceiptEmail,
  buildInvoicePaymentReceivedEmail,
  buildMerchantNewOrderEmail,
  buildStorefrontContactUrl,
  buildStorefrontOrdersUrl,
  normalizeOrderEmailItems,
  orderLabelFrom,
  type OrderEmailItem
} from "./order-email-templates"

export type InvoiceStatus = "on_hold" | "processing" | "completed" | "cancelled"

export type InvoiceShipping = {
  firstName?: string
  lastName?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  postalCode?: string
  phone?: string
  country?: string
}

export type ManualCardInvoiceRow = {
  order_id: string
  email: string
  display_id: number | null
  first_name: string | null
  last_name: string | null
  payment_method: string
  payment_method_title: string
  status: InvoiceStatus
  amount_usd: string
  currency: string
  items: OrderEmailItem[]
  shipping: InvoiceShipping | null
  internal_note: string
  paid_at: string | null
  created_at: string
}

export type RecordInvoiceInput = {
  orderId: string
  email: string
  displayId?: number | null
  firstName?: string
  lastName?: string
  amountUsd: number
  currency?: string
  items?: OrderEmailItem[]
  shipping?: InvoiceShipping | null
  paymentMethodTitle?: string
}

function shippingLines(shipping?: InvoiceShipping | null) {
  if (!shipping) return []
  return [
    [shipping.firstName, shipping.lastName].filter(Boolean).join(" "),
    shipping.company,
    shipping.address1,
    shipping.address2,
    [shipping.city, shipping.province, shipping.postalCode].filter(Boolean).join(", "),
    shipping.country,
    shipping.phone
  ].filter((line): line is string => Boolean(line && line.trim()))
}

export async function recordManualCardInvoice(input: RecordInvoiceInput) {
  const email = input.email.trim()
  const items = normalizeOrderEmailItems(input.items)
  const title = input.paymentMethodTitle?.trim() || MANUAL_CARD_INVOICE_TITLE
  const firstName = input.firstName?.trim() || ""
  const lastName = input.lastName?.trim() || ""

  const persisted = await withDb(
    async (db) => {
      await db.query(`
        CREATE TABLE IF NOT EXISTS manual_card_invoices (
          order_id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          display_id INTEGER,
          first_name TEXT,
          last_name TEXT,
          payment_method TEXT NOT NULL DEFAULT 'manual_card_invoice',
          payment_method_title TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'on_hold',
          amount_usd NUMERIC(12, 2) NOT NULL,
          currency TEXT NOT NULL DEFAULT 'USD',
          items JSONB NOT NULL DEFAULT '[]'::jsonb,
          shipping JSONB,
          internal_note TEXT NOT NULL DEFAULT 'Awaiting invoice payment',
          paid_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `)
      const result = await db.query<ManualCardInvoiceRow>(
        `
        INSERT INTO manual_card_invoices (
          order_id,
          email,
          display_id,
          first_name,
          last_name,
          payment_method,
          payment_method_title,
          status,
          amount_usd,
          currency,
          items,
          shipping,
          internal_note
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'on_hold',$8,$9,$10::jsonb,$11::jsonb,$12)
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          display_id = EXCLUDED.display_id,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          payment_method_title = EXCLUDED.payment_method_title,
          amount_usd = EXCLUDED.amount_usd,
          items = EXCLUDED.items,
          shipping = EXCLUDED.shipping,
          updated_at = NOW()
        RETURNING *
      `,
        [
          input.orderId,
          email,
          input.displayId ?? null,
          firstName || null,
          lastName || null,
          MANUAL_CARD_INVOICE_ID,
          title,
          input.amountUsd,
          input.currency || "USD",
          JSON.stringify(items),
          JSON.stringify(input.shipping || null),
          MANUAL_CARD_INVOICE_INTERNAL_NOTE
        ]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  const orderLabel = orderLabelFrom(input.displayId, input.orderId)
  const contactUrl = buildStorefrontContactUrl()

  const customerEmail = buildInvoiceOrderReceiptEmail({
    firstName,
    orderLabel,
    total: input.amountUsd,
    items,
    contactUrl,
    brandShort: EMAIL_BRAND_SHORT
  })

  const merchantEmail = buildMerchantNewOrderEmail({
    orderLabel,
    orderId: input.orderId,
    email,
    firstName,
    lastName,
    total: input.amountUsd,
    paymentMethodTitle: title,
    items,
    shippingLines: shippingLines(input.shipping)
  })

  const [customer, merchant] = await Promise.all([
    sendHtmlEmail({ to: email, subject: customerEmail.subject, html: customerEmail.html }),
    sendHtmlEmail({
      to: opsNewOrderEmail(),
      subject: merchantEmail.subject,
      html: merchantEmail.html
    })
  ])

  return {
    ok: Boolean(persisted),
    order_id: input.orderId,
    status: "on_hold" as const,
    paid_at: null,
    customer_email: customer,
    merchant_email: merchant
  }
}

export async function listManualCardInvoices(status: InvoiceStatus | "all" = "on_hold") {
  return withDb(
    async (db) => {
      const result =
        status === "all"
          ? await db.query<ManualCardInvoiceRow>(
              `SELECT * FROM manual_card_invoices ORDER BY created_at DESC LIMIT 100`
            )
          : await db.query<ManualCardInvoiceRow>(
              `SELECT * FROM manual_card_invoices WHERE status = $1 ORDER BY created_at DESC LIMIT 100`,
              [status]
            )
      return result.rows
    },
    async () => [] as ManualCardInvoiceRow[]
  )
}

export async function loadManualCardInvoice(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<ManualCardInvoiceRow>(
        `SELECT * FROM manual_card_invoices WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}

export async function markInvoicePaid(orderId: string, scope: MedusaContainer) {
  const existing = await loadManualCardInvoice(orderId)
  if (!existing) {
    return { ok: false as const, status: 404, message: "Invoice order not found" }
  }
  if (existing.status !== "on_hold") {
    return {
      ok: false as const,
      status: 409,
      message: `Order is ${existing.status}, not on hold`
    }
  }

  const updated = await withDb(
    async (db) => {
      const result = await db.query<ManualCardInvoiceRow>(
        `
        UPDATE manual_card_invoices
        SET status = 'processing', paid_at = NOW(), updated_at = NOW()
        WHERE order_id = $1 AND status = 'on_hold'
        RETURNING *
      `,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  if (!updated) {
    return { ok: false as const, status: 409, message: "Order is no longer on hold" }
  }

  const capture = await captureOrderPayment(orderId, scope)
  if (!capture.ok) {
    console.warn("[manual-card-invoice] Medusa capture failed:", capture.reason)
  }

  const items = normalizeOrderEmailItems(updated.items)
  const orderLabel = orderLabelFrom(updated.display_id, updated.order_id)
  const total = Number(updated.amount_usd)
  const email = buildInvoicePaymentReceivedEmail({
    firstName: updated.first_name || "",
    orderLabel,
    total,
    items,
    ordersUrl: buildStorefrontOrdersUrl(),
    contactUrl: buildStorefrontContactUrl()
  })

  const sent = await sendHtmlEmail({
    to: updated.email,
    subject: email.subject,
    html: email.html
  })

  await cancelOrderEmailSchedule(orderId)
  await scheduleTrackingSlaEmail({
    orderId,
    email: updated.email,
    displayId: updated.display_id,
    items
  })
  await cancelCustomerLifecycleOnPaidOrder({ email: updated.email })
  await cancelReplenishmentEmailsOnPaidOrder({
    email: updated.email,
    excludeOrderId: orderId
  })

  return {
    ok: true as const,
    order_id: orderId,
    status: updated.status,
    paid_at: updated.paid_at,
    capture,
    emailed: sent
  }
}

/** Processing → completed after ops records tracking. Leaves on-hold rows alone. */
export async function completeManualCardInvoiceOnShip(orderId: string) {
  return withDb(
    async (db) => {
      const result = await db.query<ManualCardInvoiceRow>(
        `
        UPDATE manual_card_invoices
        SET status = 'completed', updated_at = NOW()
        WHERE order_id = $1 AND status = 'processing'
        RETURNING *
      `,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )
}
