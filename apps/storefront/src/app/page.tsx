import Link from "next/link"

export default function HomePage() {
  return (
    <section className="space-y-10">
      <div className="space-y-5 rounded-xl border border-white/10 bg-[#0A0A10] p-8">
        <p className="inline-block rounded-md border border-[#FBBF24]/30 px-3 py-1 text-xs text-[#FBBF24]">
          Research Use Only
        </p>
        <h1 className="text-4xl font-semibold md:text-5xl">Tetrava Labs</h1>
        <p className="max-w-3xl text-[#8A8AA0]">
          Laboratory-grade peptide catalog with Medusa-backed products, RUO compliance controls,
          and batch-level COA document support.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/shop" className="rounded-md bg-[#5EEAD4] px-4 py-2 text-[#050508]">
            Browse Catalog
          </Link>
          <Link href="/coa-library" className="rounded-md border border-white/20 px-4 py-2">
            View COA Library
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          "HPLC / COA ready",
          "Crypto-first checkout",
          "RUO compliance tracking"
        ].map((item) => (
          <div key={item} className="rounded-lg border border-white/10 bg-[#0A0A10] p-4">
            <p className="text-sm text-[#E8E8F0]">{item}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
