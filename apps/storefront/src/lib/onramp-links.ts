export type OnrampRegion = "us" | "eu" | "global"

const EU_COUNTRIES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "GB",
  "NO",
  "CH",
  "IS"
])

export function resolveOnrampRegion(countryCode: string | null | undefined): OnrampRegion {
  if (!countryCode) return "global"
  const code = countryCode.toUpperCase()
  if (code === "US") return "us"
  if (EU_COUNTRIES.has(code)) return "eu"
  return "global"
}

export type OnrampLink = {
  id: string
  label: string
  description: string
  href: string
  external: true
}

export function buildOnrampLinks(amountUsd: number, region: OnrampRegion): OnrampLink[] {
  const amount = amountUsd.toFixed(2)
  const coinbaseAppId = process.env.NEXT_PUBLIC_COINBASE_APP_ID?.trim()

  if (region === "us") {
    const coinbaseHref = coinbaseAppId
      ? `https://pay.coinbase.com/buy/select-asset?appId=${encodeURIComponent(coinbaseAppId)}&presetFiatAmount=${amount}&fiatCurrency=USD&defaultAsset=USDC&defaultNetwork=base`
      : `https://www.coinbase.com/buy/usdc?amount=${amount}&currency=USD`

    return [
      {
        id: "coinbase",
        label: "Buy on Coinbase",
        description: "USDC on Base — gas-free transfers for Coinbase users",
        href: coinbaseHref,
        external: true
      },
      {
        id: "moonpay",
        label: "Buy on MoonPay",
        description: "Card or bank — USDC delivered to your wallet",
        href: `https://www.moonpay.com/buy/usdc?baseCurrencyAmount=${amount}&baseCurrencyCode=usd`,
        external: true
      }
    ]
  }

  if (region === "eu") {
    return [
      {
        id: "ramp",
        label: "Buy on Ramp",
        description: "SEPA and card on-ramp to USDC",
        href: `https://app.ramp.network/?hostApiKey=&swapAsset=USDC_BASE&fiatValue=${amount}&fiatCurrency=USD`,
        external: true
      },
      {
        id: "binance",
        label: "Buy on Binance",
        description: "Purchase USDC, then return here to pay",
        href: `https://www.binance.com/en/buy-sell-crypto?fiat=EUR-USD&crypto=USDC`,
        external: true
      },
      {
        id: "moonpay",
        label: "Buy on MoonPay",
        description: "Global card on-ramp",
        href: `https://www.moonpay.com/buy/usdc?baseCurrencyAmount=${amount}&baseCurrencyCode=usd`,
        external: true
      }
    ]
  }

  return [
    {
      id: "moonpay",
      label: "Buy on MoonPay",
      description: "Card or bank — works in most countries",
      href: `https://www.moonpay.com/buy/usdc?baseCurrencyAmount=${amount}&baseCurrencyCode=usd`,
      external: true
    },
    {
      id: "ramp",
      label: "Buy on Ramp",
      description: "Alternative on-ramp to USDC",
      href: `https://app.ramp.network/?swapAsset=USDC_BASE&fiatValue=${amount}&fiatCurrency=USD`,
      external: true
    },
    {
      id: "coinbase",
      label: "Buy on Coinbase",
      description: "If available in your region",
      href: coinbaseAppId
        ? `https://pay.coinbase.com/buy/select-asset?appId=${encodeURIComponent(coinbaseAppId)}&presetFiatAmount=${amount}&fiatCurrency=USD&defaultAsset=USDC`
        : `https://www.coinbase.com/buy/usdc?amount=${amount}&currency=USD`,
      external: true
    }
  ]
}
