import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  CRYPTO_ASSET_LABELS,
  getAvailableCheckoutCryptoAssets,
  resolveCryptoCheckoutProviderForAsset
} from "../../../../lib/crypto-provider"
import { MANUAL_CARD_INVOICE_TITLE } from "../../../../lib/manual-card-invoice-config"
import { isCardToUsdtConfigured } from "../../../../lib/cardtousdt"
import { isPaymentoConfigured } from "../../../../lib/paymento"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const assets = getAvailableCheckoutCryptoAssets()

  res.setHeader("Cache-Control", "no-store, max-age=0")

  return res.json({
    ok: true,
    card: {
      available: true,
      provider: isCardToUsdtConfigured() ? "cardtousdt" : "manual_card_invoice",
      label: MANUAL_CARD_INVOICE_TITLE,
      open_in_new_tab: isCardToUsdtConfigured()
    },
    crypto: {
      available: assets.length > 0,
      paymento_configured: isPaymentoConfigured(),
      assets: assets.map((asset) => ({
        asset,
        label: CRYPTO_ASSET_LABELS[asset],
        provider: resolveCryptoCheckoutProviderForAsset(asset)
      }))
    }
  })
}
