const badges = [
  { label: "HPLC Verified", desc: "Independent lab purity testing" },
  { label: "Cold-Chain", desc: "Thermal-protected shipping" },
  { label: "COA Included", desc: "Certificate of Analysis" },
  { label: "Secure Checkout", desc: "Crypto-first payments" }
]

export function TrustStrip() {
  return (
    <section className="rounded-xl border border-white/10 bg-[#0A0A10] px-6 py-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {badges.map((badge) => (
          <div key={badge.label} className="text-center">
            <p className="text-sm font-medium text-[#E8E8F0]">{badge.label}</p>
            <p className="mt-1 text-xs text-[#8A8AA0]">{badge.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
