import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { createPeptidepayCheckoutSession, isPeptidepayConfigured } from "../../../../lib/peptidepay"

type Body = {
  order_id?: string
  email?: string
  amount_usd?: number
  currency?: string
  product_name?: string
}

async function saveIntent(
  orderId: string,
  email: string,
  amountUsd: number,
  currency: string,
  providerUrl: string,
  sessionId: string
) {
  await withDb(
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
        [orderId, email, amountUsd, currency, providerUrl, sessionId]
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
  const productName = req.body?.product_name?.trim()

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, amount_usd are required" })
  }

  if (!isPeptidepayConfigured()) {
    return res.status(503).json({
      ok: false,
      message: "Card checkout requires Peptide Pay (PEPTIDEPAY_API_KEY and PEPTIDEPAY_WEBHOOK_SECRET)."
    })
  }

  const sessionResult = await createPeptidepayCheckoutSession({
    orderId,
    email,
    amountUsd,
    currency,
    productName
  })

  if (!sessionResult.ok) {
    return res.status(502).json({ ok: false, message: sessionResult.error })
  }

  const { session } = sessionResult
  await saveIntent(orderId, email, amountUsd, currency, session.url, session.id)

  return res.json({
    ok: true,
    order_id: orderId,
    provider: "peptidepay",
    provider_url: session.url,
    session_id: session.id,
    message: "Peptide Pay checkout session created"
  })
}
