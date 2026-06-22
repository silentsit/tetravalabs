export type CheckoutCryptoOption = {
  asset: string
  label: string
  provider: string
}

/** Shown in UI when Medusa gateways are not yet reachable — matches production routing. */
export const CHECKOUT_CRYPTO_CATALOG: CheckoutCryptoOption[] = [
  { asset: "BTC", label: "Bitcoin (BTC)", provider: "btcpay" },
  { asset: "USDT", label: "USDT (ERC-20)", provider: "paymento" },
  { asset: "USDT_TRC20", label: "USDT (TRX)", provider: "paymento" },
  { asset: "USDC", label: "USD Coin (USDC)", provider: "paymento" },
  { asset: "ETH", label: "Ethereum (ETH)", provider: "paymento" },
  { asset: "SOL", label: "Solana (SOL)", provider: "paymento" },
  { asset: "LTC", label: "Litecoin (LTC)", provider: "paymento" },
  { asset: "BNB", label: "BNB", provider: "paymento" },
  { asset: "TRX", label: "TRON (TRX)", provider: "paymento" }
]

export type LoadedCheckoutOptions = {
  cardAvailable: boolean
  cryptoLive: boolean
  cryptoOptions: CheckoutCryptoOption[]
}

export async function loadCheckoutPaymentOptions(
  fetchFn: typeof fetch,
  medusaUrl: string,
  headers: HeadersInit
): Promise<LoadedCheckoutOptions> {
  const fallback: LoadedCheckoutOptions = {
    cardAvailable: false,
    cryptoLive: false,
    cryptoOptions: CHECKOUT_CRYPTO_CATALOG
  }

  try {
    const primary = await fetchFn(`${medusaUrl}/store/payments/checkout-options`, { headers })
    if (primary.ok) {
      const data = await primary.json()
      if (data?.ok) {
        const liveAssets = Array.isArray(data.crypto?.assets) ? data.crypto.assets : []
        return {
          cardAvailable: Boolean(data.card?.available),
          cryptoLive: liveAssets.length > 0,
          cryptoOptions: liveAssets.length > 0 ? liveAssets : CHECKOUT_CRYPTO_CATALOG
        }
      }
    }

    const legacy = await fetchFn(`${medusaUrl}/store/payments/crypto-options`, { headers })
    if (legacy.ok) {
      const data = await legacy.json()
      const liveAssets = Array.isArray(data?.assets) ? data.assets : []
      return {
        cardAvailable: false,
        cryptoLive: liveAssets.length > 0,
        cryptoOptions: liveAssets.length > 0 ? liveAssets : CHECKOUT_CRYPTO_CATALOG
      }
    }
  } catch {
    // Use catalog fallback below.
  }

  return fallback
}
