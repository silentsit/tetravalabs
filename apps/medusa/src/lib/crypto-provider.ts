import { isBtcpayConfigured } from "./btcpay"
import { isPaymentoConfigured } from "./paymento"

export type CryptoCheckoutProvider = "btcpay" | "paymento"

export const ACCEPTED_CRYPTO_ASSETS = [
  "BTC",
  "USDT",
  "USDT_TRC20",
  "USDC",
  "BNB",
  "TRX",
  "SOL",
  "ETH",
  "LTC",
  "PAXG"
] as const

export type CryptoAsset = (typeof ACCEPTED_CRYPTO_ASSETS)[number]

export const BTCPAY_CHECKOUT_ASSETS: CryptoAsset[] = ["BTC"]

export const CRYPTO_ASSET_LABELS: Record<CryptoAsset, string> = {
  BTC: "Bitcoin (BTC)",
  USDT: "USDT (ERC-20)",
  USDT_TRC20: "USDT (TRX)",
  USDC: "USD Coin (USDC)",
  BNB: "BNB",
  TRX: "TRON (TRX)",
  SOL: "Solana (SOL)",
  ETH: "Ethereum (ETH)",
  LTC: "Litecoin (LTC)",
  PAXG: "PAX Gold (PAXG)"
}

function forcedCryptoProviderOverride(): CryptoCheckoutProvider | undefined {
  const raw = process.env.CRYPTO_PROVIDER?.trim()
  if (raw === "btcpay" || raw === "paymento") return raw
  return undefined
}

export function isAcceptedCryptoAsset(value: string): value is CryptoAsset {
  return (ACCEPTED_CRYPTO_ASSETS as readonly string[]).includes(value)
}

function isBtcpayRoutedAsset(asset: CryptoAsset): boolean {
  return BTCPAY_CHECKOUT_ASSETS.includes(asset)
}

/** Resolve which gateway handles checkout for a specific asset. */
export function resolveCryptoCheckoutProviderForAsset(asset: CryptoAsset): CryptoCheckoutProvider | null {
  const pref = forcedCryptoProviderOverride()

  if (pref === "btcpay") {
    return isBtcpayConfigured() ? "btcpay" : null
  }
  if (pref === "paymento") {
    return isPaymentoConfigured() ? "paymento" : null
  }

  if (isBtcpayRoutedAsset(asset)) {
    if (isBtcpayConfigured()) return "btcpay"
    return null
  }

  if (isPaymentoConfigured()) return "paymento"
  return null
}

export function getAvailableCheckoutCryptoAssets(): CryptoAsset[] {
  return ACCEPTED_CRYPTO_ASSETS.filter((asset) => resolveCryptoCheckoutProviderForAsset(asset) !== null)
}

export function cryptoCheckoutMisconfigMessageForAsset(asset: CryptoAsset): string {
  const pref = forcedCryptoProviderOverride()

  if (pref === "btcpay" && !isBtcpayConfigured()) {
    return "Bitcoin checkout requires BTCPay (BTCPAY_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID, BTCPAY_WEBHOOK_SECRET)."
  }
  if (pref === "paymento" && !isPaymentoConfigured()) {
    return "This asset requires Paymento (PAYMENTO_API_KEY and PAYMENTO_SECRET_KEY)."
  }

  if (isBtcpayRoutedAsset(asset)) {
    return (
      "Bitcoin checkout requires BTCPay. Configure BTCPay or choose a different asset supported by Paymento."
    )
  }

  return "This asset requires Paymento. Configure Paymento or choose Bitcoin if BTCPay is available."
}
