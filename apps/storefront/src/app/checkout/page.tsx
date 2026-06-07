export const dynamic = "force-dynamic"

export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="text-[#8A8AA0]">
        Crypto-first checkout shell with manual fallback rails. Payment sessions are created
        in Medusa and updated by crypto webhook events.
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-[#8A8AA0]">
        <li>Primary: crypto provider (BTCPay/Paymento-style)</li>
        <li>Secondary: high-risk card rails via NMI/Authorize.Net</li>
        <li>Compliance: RUO acknowledgment required before payment creation</li>
      </ul>
    </section>
  )
}
