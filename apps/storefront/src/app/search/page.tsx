import Link from "next/link"
import { searchProducts } from "@/lib/search"

type Props = { searchParams: Promise<{ q?: string }> }

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const results = await searchProducts(q)

  return (
    <section className="space-y-5">
      <h1 className="text-3xl font-semibold">Search</h1>
      <form action="/search" className="max-w-xl">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, CAS, formula, sequence..."
          className="w-full rounded border border-white/20 bg-[#0A0A10] px-3 py-2"
        />
      </form>
      <p className="text-sm text-[#8A8AA0]">{results.length} result(s)</p>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <Link
            key={result.id}
            href={`/product/${result.handle}`}
            className="rounded border border-white/10 bg-[#0A0A10] p-4"
          >
            <h2 className="text-lg text-[#E8E8F0]">{result.title}</h2>
            <p className="text-xs text-[#8A8AA0]">{result.category}</p>
            <p className="mt-2 text-sm text-[#E8E8F0]">
              ${(result.price_min / 100).toFixed(2)} - ${(result.price_max / 100).toFixed(2)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
