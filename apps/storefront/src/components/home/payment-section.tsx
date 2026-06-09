const cryptoSteps = [
  "Add compounds to cart",
  "Select coin at checkout",
  "Send to displayed wallet",
  "We confirm and ship"
]

const cardSteps = [
  "Add to cart",
  "Click buy crypto at checkout",
  "Pay with card in minutes",
  "Send to our wallet address"
]

export function PaymentSection() {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#E8E8F0]">Simple Payment System</h2>
        <p className="mt-3 text-[#8A8AA0]">Two paths. Zero friction.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#0A0A10] p-8">
          <h3 className="font-serif text-xl text-[#E8E8F0]">Have Crypto?</h3>
          <ol className="mt-6 space-y-3">
            {cryptoSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-[#E8E8F0]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5EEAD4] text-xs font-medium text-[#050508]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0A0A10] p-8">
          <h3 className="font-serif text-xl text-[#E8E8F0]">New to Crypto?</h3>
          <ol className="mt-6 space-y-3">
            {cardSteps.map((step, index) => (
              <li key={step} className="flex items-center gap-3 text-sm text-[#E8E8F0]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#A78BFA] text-xs font-medium text-[#050508]">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="rounded-xl border border-[#FBBF24]/20 bg-white/[0.03] p-5 text-sm text-[#FBBF24]/90">
        When prompted, paste our wallet address exactly as shown at checkout.
      </p>
    </section>
  )
}
