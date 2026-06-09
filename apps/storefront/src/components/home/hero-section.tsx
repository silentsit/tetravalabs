import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0A0A10] to-[#050508] px-6 py-20 text-center md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl space-y-6">
        <span className="inline-block rounded-full border border-[#5EEAD4]/40 px-4 py-1.5 font-mono text-[11px] tracking-wider text-[#5EEAD4]">
          99.8% PURITY GUARANTEED
        </span>
        <h1 className="font-serif text-4xl leading-tight text-[#E8E8F0] md:text-6xl">
          Precision Research Compounds
        </h1>
        <p className="text-base leading-relaxed text-[#8A8AA0] md:text-lg">
          Laboratory-grade peptides and research materials. Third-party tested. Global cold-chain
          shipping.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-lg bg-[#5EEAD4] px-8 py-3 text-sm font-medium text-[#050508] transition hover:brightness-110"
          >
            Shop Catalog
          </Link>
          <Link
            href="/coa-library"
            className="rounded-lg border border-white/10 px-8 py-3 text-sm text-[#E8E8F0] transition hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
          >
            View COA Reports
          </Link>
        </div>
      </div>
    </section>
  )
}
