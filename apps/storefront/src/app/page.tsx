import Link from "next/link"

export default function HomePage() {
  return (
    <section className="space-y-6">
      <p className="inline-block rounded-md border border-[#FBBF24]/30 px-3 py-1 text-xs text-[#FBBF24]">
        Research Use Only
      </p>
      <h1 className="text-4xl font-semibold">Tetrava Labs Storefront</h1>
      <p className="max-w-2xl text-[#8A8AA0]">
        Production Next.js App Router storefront wired for Medusa, RUO compliance gating,
        crypto-first checkout, and batch-level COA integrations.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="rounded-md bg-[#5EEAD4] px-4 py-2 text-[#050508]">
          Browse Catalog
        </Link>
        <Link href="/checkout" className="rounded-md border border-white/20 px-4 py-2">
          Checkout Shell
        </Link>
      </div>
    </section>
  )
}
