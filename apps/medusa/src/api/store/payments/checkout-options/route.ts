import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { isBtcpayConfigured } from "../../../../lib/btcpay"
import {
  CRYPTO_ASSET_LABELS,
  getAvailableCheckoutCryptoAssets,
  resolveCryptoCheckoutProviderForAsset
} from "../../../../lib/crypto-provider"
import { isPeptidepayConfigured } from "../../../../lib/peptidepay"
import { isPaymentoConfigured } from "../../../../lib/paymento"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const assets = getAvailableCheckoutCryptoAssets()
  const cardAvailable = isPeptidepayConfigured()

  res.setHeader("Cache-Control", "no-store, max-age=0")

  return res.json({
    ok: true,
    card: {
      available: cardAvailable,
      provider: cardAvailable ? "peptidepay" : null,
      label: "Credit or debit card"
    },
    crypto: {
      available: assets.length > 0,
      btcpay_configured: isBtcpayConfigured(),
      paymento_configured: isPaymentoConfigured(),
      assets: assets.map((asset) => ({
        asset,
        label: CRYPTO_ASSET_LABELS[asset],
        provider: resolveCryptoCheckoutProviderForAsset(asset)
      }))
    }
  })
}
