import Link from "next/link"

export default function ShippingRestrictedPage() {
  return (
    <section className="mx-auto max-w-xl space-y-4">
      <h1 className="text-3xl font-semibold">Shipping Restricted</h1>
      <p className="text-[#8A8AA0]">
        Checkout is unavailable for your selected or detected location under our research-use
        shipping compliance policy.
      </p>
      <div className="rounded-lg border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-4 text-sm text-[#FBBF24]">
        If you believe this is an error, contact research support with your institution details and
        intended shipping address.
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/shop" className="rounded border border-white/20 px-4 py-2 text-sm">
          Browse catalog
        </Link>
        <Link href="/contact" className="rounded bg-[#5EEAD4] px-4 py-2 text-sm text-[#050508]">
          Contact support
        </Link>
      </div>
    </section>
  )
}
