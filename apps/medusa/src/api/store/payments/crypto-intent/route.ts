import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"

type Body = {
  order_id?: string
  email?: string
  amount_usd?: number
  currency?: string
}

export const POST = async (req: MedusaRequest<Body>, res: MedusaResponse) => {
  const orderId = req.body?.order_id
  const email = req.body?.email
  const amountUsd = Number(req.body?.amount_usd || 0)
  const currency = (req.body?.currency || "USD").toUpperCase()

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, amount_usd are required" })
  }

  const checkoutBase = process.env.CRYPTO_CHECKOUT_BASE_URL || "https://example.com/crypto-checkout"
  const checkoutUrl = `${checkoutBase}?order_id=${encodeURIComponent(orderId)}&amount=${amountUsd.toFixed(2)}&currency=${currency}`

  await withDb(
    async (db) => {
      await db.query(
        `
        INSERT INTO crypto_payment_intents (order_id, email, amount_usd, currency, provider_url)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (order_id) DO UPDATE SET
          email = EXCLUDED.email,
          amount_usd = EXCLUDED.amount_usd,
          currency = EXCLUDED.currency,
          provider_url = EXCLUDED.provider_url
      `,
        [orderId, email, amountUsd, currency, checkoutUrl]
      )
    },
    async () => undefined
  )

  return res.json({
    ok: true,
    order_id: orderId,
    provider_url: checkoutUrl,
    message: "Use provider_url to continue crypto checkout"
  })
}
