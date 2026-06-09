import Link from "next/link"

const stats = [
  { label: "Compounds", value: "120+" },
  { label: "Purity Standard", value: "99%+" },
  { label: "Research Clients", value: "5,000+" },
  { label: "Countries Shipped", value: "40+" }
]

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">About Us</p>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0]">About Tetrava Labs</h1>
      </div>
      <div className="space-y-6 text-base leading-relaxed text-[#8A8AA0]">
        <p>
          Tetrava Labs provides the scientific community with access to high-quality, verified research
          compounds. Every product in our catalog is backed by transparent analytical data and strict
          research-use-only compliance controls.
        </p>
        <p>
          Our team includes researchers, analytical chemists, and logistics specialists with experience in
          peptide synthesis, quality control, and scientific supply chain management. We serve research
          institutions, biotechnology firms, and independent laboratories worldwide.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-5 text-center">
            <p className="font-serif text-2xl text-[#E8E8F0]">{stat.value}</p>
            <p className="mt-1 text-xs text-[#8A8AA0]">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
        <h2 className="font-serif text-2xl text-[#E8E8F0]">Our Mission</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#8A8AA0]">
          To advance scientific discovery by providing researchers with reliable materials, batch-level
          documentation, and responsive support. Reliable materials are the foundation of reliable science.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508]">
          Browse Catalog
        </Link>
        <Link href="/coa-library" className="rounded-lg border border-white/10 px-6 py-2.5 text-sm text-[#E8E8F0]">
          View COA Library
        </Link>
      </div>
    </section>
  )
}
