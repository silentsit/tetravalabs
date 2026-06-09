import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { createBtcpayInvoice, isBtcpayConfigured } from "../../../../lib/btcpay"

type Body = {
  order_id?: string
  email?: string
  amount_usd?: number
  currency?: string
}

async function saveIntent(
  orderId: string,
  email: string,
  amountUsd: number,
  currency: string,
  providerUrl: string,
  provider: string,
  providerPaymentId: string | null = null
) {
  await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO crypto_payment_intents (
          order_id, email, amount_usd, currency, provider_url, provider_payment_id, provider, status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,'pending')
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          amount_usd = EXCLUDED.amount_usd,
          currency = EXCLUDED.currency,
          provider_url = EXCLUDED.provider_url,
          provider_payment_id = EXCLUDED.provider_payment_id,
          provider = EXCLUDED.provider,
          status = 'pending'
      `,
        [orderId, email, amountUsd, currency, providerUrl, providerPaymentId ?? null, provider]
      )
    },
    async () => undefined
  )
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = req.query?.order_id as string | undefined
  if (!orderId) {
    return res.status(400).json({ message: "order_id is required" })
  }

  const intent = await withDb(
    async (db) => {
      const result = await db.query(
        `SELECT order_id, provider_url, status, amount_usd, currency, provider FROM crypto_payment_intents WHERE order_id = $1 LIMIT 1`,
        [orderId]
      )
      return result.rows[0] || null
    },
    async () => null
  )

  if (!intent) {
    return res.status(404).json({ message: "Payment intent not found" })
  }

  return res.json({
    ok: true,
    order_id: intent.order_id,
    provider_url: intent.provider_url,
    status: intent.status,
    amount_usd: Number(intent.amount_usd),
    currency: intent.currency,
    provider: intent.provider
  })
}

export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id
  const email = req.body?.email
  const amountUsd = Number(req.body?.amount_usd || 0)
  const currency = (req.body?.currency || "USD").toUpperCase()

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, amount_usd are required" })
  }

  if (isBtcpayConfigured()) {
    try {
      const invoice = await createBtcpayInvoice({
        orderId,
        email,
        amountUsd,
        currency
      })

      await saveIntent(orderId, email, amountUsd, currency, invoice.checkoutUrl, "btcpay", invoice.invoiceId)

      return res.json({
        ok: true,
        order_id: orderId,
        provider: "btcpay",
        provider_url: invoice.checkoutUrl,
        invoice_id: invoice.invoiceId,
        message: "BTCPay invoice created"
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "BTCPay invoice failed"
      return res.status(502).json({ ok: false, message })
    }
  }

  const checkoutBase = process.env.CRYPTO_CHECKOUT_BASE_URL || "https://example.com/crypto-checkout"
  const checkoutUrl = `${checkoutBase}?order_id=${encodeURIComponent(orderId)}&amount=${amountUsd.toFixed(2)}&currency=${currency}`

  await saveIntent(orderId, email, amountUsd, currency, checkoutUrl, "placeholder")

  return res.json({
    ok: true,
    order_id: orderId,
    provider: "placeholder",
    provider_url: checkoutUrl,
    message: "Configure BTCPAY_URL, BTCPAY_API_KEY, and BTCPAY_STORE_ID for live crypto checkout"
  })
}
