import { isPaymentoConfigured } from "./paymento"

export type CryptoCheckoutProvider = "paymento"

export const ACCEPTED_CRYPTO_ASSETS = [
  "USDT",
  "USDT_TRC20",
  "USDC",
  "BNB",
  "TRX",
  "SOL",
  "ETH",
  "PAXG"
] as const

export type CryptoAsset = (typeof ACCEPTED_CRYPTO_ASSETS)[number]

export const CRYPTO_ASSET_LABELS: Record<CryptoAsset, string> = {
  USDT: "USDT (ERC-20)",
  USDT_TRC20: "USDT (TRX)",
  USDC: "USD Coin (USDC)",
  BNB: "BNB",
  TRX: "TRON (TRX)",
  SOL: "Solana (SOL)",
  ETH: "Ethereum (ETH)",
  PAXG: "PAX Gold (PAXG)"
}

export function isAcceptedCryptoAsset(value: string): value is CryptoAsset {
  return (ACCEPTED_CRYPTO_ASSETS as readonly string[]).includes(value)
}

/** All accepted assets route through Paymento when configured. */
export function resolveCryptoCheckoutProviderForAsset(
  _asset: CryptoAsset
): CryptoCheckoutProvider | null {
  return isPaymentoConfigured() ? "paymento" : null
}

export function getAvailableCheckoutCryptoAssets(): CryptoAsset[] {
  if (!isPaymentoConfigured()) return []
  return [...ACCEPTED_CRYPTO_ASSETS]
}

export function cryptoCheckoutMisconfigMessageForAsset(_asset: CryptoAsset): string {
  return "Crypto checkout requires Paymento (PAYMENTO_API_KEY and PAYMENTO_SECRET_KEY)."
}
