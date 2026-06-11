import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { isBtcpayConfigured } from "../../../../lib/btcpay"
import {
  CRYPTO_ASSET_LABELS,
  getAvailableCheckoutCryptoAssets,
  resolveCryptoCheckoutProviderForAsset
} from "../../../../lib/crypto-provider"
import { isPaymentoConfigured } from "../../../../lib/paymento"

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  const assets = getAvailableCheckoutCryptoAssets()

  return res.json({
    ok: true,
    btcpay_configured: isBtcpayConfigured(),
    paymento_configured: isPaymentoConfigured(),
    assets: assets.map((asset) => ({
      asset,
      label: CRYPTO_ASSET_LABELS[asset],
      provider: resolveCryptoCheckoutProviderForAsset(asset)
    }))
  })
}
