import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { withDb } from "../../../../lib/db"
import { createBtcpayInvoice, isBtcpayConfigured } from "../../../../lib/btcpay"
import {
  cryptoCheckoutMisconfigMessageForAsset,
  getAvailableCheckoutCryptoAssets,
  isAcceptedCryptoAsset,
  resolveCryptoCheckoutProviderForAsset,
  type CryptoAsset
} from "../../../../lib/crypto-provider"
import {
  getPaymentoSpeedFromEnv,
  isPaymentoConfigured,
  paymentoCreatePaymentRequest,
  paymentoGatewayUrl
} from "../../../../lib/paymento"

type Body = {
  order_id?: string
  email?: string
  amount_usd?: number
  currency?: string
  crypto_asset?: string
}

function getReturnUrl() {
  const storeOrigin =
    process.env.STOREFRONT_URL ||
    process.env.STORE_CORS?.split(",")[0]?.trim() ||
    "http://localhost:3000"
  return `${storeOrigin.replace(/\/$/, "")}/orders?payment=complete`
}

function normalizeAsset(value: string | undefined): CryptoAsset {
  const asset = (value || "BTC").trim().toUpperCase()
  if (isAcceptedCryptoAsset(asset)) return asset
  return "BTC"
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
  const asset = normalizeAsset(req.body?.crypto_asset)

  if (!orderId || !email || amountUsd <= 0) {
    return res.status(400).json({ message: "order_id, email, amount_usd are required" })
  }

  const provider = resolveCryptoCheckoutProviderForAsset(asset)
  if (!provider) {
    return res.status(503).json({
      ok: false,
      message: cryptoCheckoutMisconfigMessageForAsset(asset),
      crypto_asset: asset
    })
  }

  if (provider === "btcpay" && isBtcpayConfigured()) {
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
        crypto_asset: asset,
        provider_url: invoice.checkoutUrl,
        invoice_id: invoice.invoiceId,
        message: "BTCPay invoice created"
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "BTCPay invoice failed"
      return res.status(502).json({ ok: false, message })
    }
  }

  if (provider === "paymento" && isPaymentoConfigured()) {
    const paymentRequest = await paymentoCreatePaymentRequest({
      fiatAmount: amountUsd.toFixed(2),
      fiatCurrency: currency,
      orderId,
      returnUrl: getReturnUrl(),
      speed: getPaymentoSpeedFromEnv(),
      emailAddress: email,
      additionalData: [{ key: "cryptoAsset", value: asset }]
    })

    if (!paymentRequest.success) {
      return res.status(502).json({ ok: false, message: `Paymento: ${paymentRequest.error}` })
    }

    const gatewayUrl = paymentoGatewayUrl(paymentRequest.token)
    await saveIntent(orderId, email, amountUsd, currency, gatewayUrl, "paymento", paymentRequest.token)

    return res.json({
      ok: true,
      order_id: orderId,
      provider: "paymento",
      crypto_asset: asset,
      provider_url: gatewayUrl,
      payment_token: paymentRequest.token,
      message: "Paymento payment request created"
    })
  }

  return res.status(503).json({
    ok: false,
    message: cryptoCheckoutMisconfigMessageForAsset(asset),
    available_assets: getAvailableCheckoutCryptoAssets()
  })
}
