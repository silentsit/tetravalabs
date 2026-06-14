/**
 * BIP21 (Bitcoin) and EIP-681 (Ethereum / ERC-20) payment URI helpers.
 * When no on-chain address is available, falls back to the provider checkout URL.
 */

export function buildBip21Uri(address: string, amountBtc: number, label?: string) {
  const params = new URLSearchParams()
  if (amountBtc > 0) params.set("amount", amountBtc.toFixed(8))
  if (label) params.set("message", label)
  const query = params.toString()
  return query ? `bitcoin:${address}?${query}` : `bitcoin:${address}`
}

export function buildEip681Uri(
  address: string,
  amountUsdc: number,
  chainId = 8453,
  tokenContract = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
) {
  const value = BigInt(Math.round(amountUsdc * 1_000_000))
  return `ethereum:${tokenContract}@${chainId}/transfer?address=${address}&uint256=${value.toString()}`
}

export function buildPaymentQrPayload(input: {
  providerUrl: string
  asset?: string
  address?: string | null
  amountUsd: number
  orderLabel?: string
}) {
  const asset = (input.asset || "").toUpperCase()

  if (asset === "BTC" && input.address) {
    const btcAmount = input.amountUsd / 100_000
    return buildBip21Uri(input.address, btcAmount, input.orderLabel)
  }

  if ((asset === "USDT" || asset === "USDC" || asset === "ETH") && input.address) {
    if (asset === "ETH") {
      const wei = BigInt(Math.round(input.amountUsd * 1e18 / 3000))
      return `ethereum:${input.address}?value=${wei.toString()}`
    }
    return buildEip681Uri(input.address, input.amountUsd)
  }

  return input.providerUrl
}
