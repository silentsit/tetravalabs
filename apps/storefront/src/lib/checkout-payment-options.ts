export type CheckoutCryptoOption = {
  asset: string
  label: string
  provider: string
}

/** Shown in UI when Medusa gateways are not yet reachable — Paymento catalog fallback. */
export const CHECKOUT_CRYPTO_CATALOG: CheckoutCryptoOption[] = [
  { asset: "USDT", label: "USDT (ERC-20)", provider: "paymento" },
  { asset: "USDT_TRC20", label: "USDT (TRX)", provider: "paymento" },
  { asset: "USDC", label: "USD Coin (USDC)", provider: "paymento" },
  { asset: "ETH", label: "Ethereum (ETH)", provider: "paymento" },
  { asset: "SOL", label: "Solana (SOL)", provider: "paymento" },
  { asset: "BNB", label: "BNB", provider: "paymento" },
  { asset: "TRX", label: "TRON (TRX)", provider: "paymento" }
]

export type CardCheckoutProvider = "cardtousdt" | "manual_card_invoice"

export type LoadedCheckoutOptions = {
  cardAvailable: boolean
  cardProvider: CardCheckoutProvider
  cardOpenInNewTab: boolean
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
    cardProvider: "manual_card_invoice",
    cardOpenInNewTab: false,
    cryptoLive: false,
    cryptoOptions: CHECKOUT_CRYPTO_CATALOG
  }

  const fetchOptions = { headers, cache: "no-store" as RequestCache }

  try {
    const primary = await fetchFn(`${medusaUrl}/store/payments/checkout-options`, fetchOptions)
    if (primary.ok) {
      const data = await primary.json()
      if (data?.ok) {
        const liveAssets = Array.isArray(data.crypto?.assets) ? data.crypto.assets : []
        return {
          cardAvailable: Boolean(data.card?.available),
          cardProvider: data.card?.provider === "cardtousdt" ? "cardtousdt" : "manual_card_invoice",
          cardOpenInNewTab: Boolean(data.card?.open_in_new_tab),
          cryptoLive: liveAssets.length > 0,
          cryptoOptions: liveAssets.length > 0 ? liveAssets : CHECKOUT_CRYPTO_CATALOG
        }
      }
    }

    const legacy = await fetchFn(`${medusaUrl}/store/payments/crypto-options`, fetchOptions)
    if (legacy.ok) {
      const data = await legacy.json()
      const liveAssets = Array.isArray(data?.assets) ? data.assets : []
      const retry = await fetchFn(`${medusaUrl}/store/payments/checkout-options`, fetchOptions)
      let cardAvailable = false
      let cardProvider: CardCheckoutProvider = "manual_card_invoice"
      let cardOpenInNewTab = false
      if (retry.ok) {
        const retryData = await retry.json()
        cardAvailable = Boolean(retryData?.card?.available)
        cardProvider = retryData?.card?.provider === "cardtousdt" ? "cardtousdt" : "manual_card_invoice"
        cardOpenInNewTab = Boolean(retryData?.card?.open_in_new_tab)
      }
      return {
        cardAvailable,
        cardProvider,
        cardOpenInNewTab,
        cryptoLive: liveAssets.length > 0,
        cryptoOptions: liveAssets.length > 0 ? liveAssets : CHECKOUT_CRYPTO_CATALOG
      }
    }
  } catch {
    // Use catalog fallback below.
  }

  return fallback
}
