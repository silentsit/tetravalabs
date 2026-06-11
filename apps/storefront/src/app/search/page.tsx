import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SearchResultCard } from "@/components/search-result-card"
import { isTypesenseConfigured, searchProducts } from "@/lib/search"

type Props = { searchParams: Promise<{ q?: string }> }

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const { results, source } = await searchProducts(q)
  const typesenseReady = isTypesenseConfigured()

  return (
    <section className="space-y-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div>
        <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Catalog</p>
        <h1 className="mt-2 font-serif text-4xl text-[#E8E8F0]">Search Compounds</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#8A8AA0]">
          Find peptides and research materials by name, CAS number, molecular formula, or amino acid
          sequence.
        </p>
      </div>

      <form action="/search" className="max-w-xl">
        <div className="flex gap-2">
          <input
            name="q"
            defaultValue={q}
            placeholder="e.g. BPC-157, 137525-51-0, C62H98N16O22"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A10] px-4 py-2.5 text-sm text-[#E8E8F0] outline-none transition focus:border-[#5EEAD4]/40"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-[#5EEAD4] px-5 py-2.5 text-sm font-medium text-[#050508] transition hover:brightness-110"
          >
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[#8A8AA0]">
        <span>
          {q ? (
            <>
              {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
            </>
          ) : (
            "Enter a query to search the catalog"
          )}
        </span>
        {q ? (
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              source === "typesense"
                ? "border-[#5EEAD4]/30 text-[#5EEAD4]"
                : "border-white/10 text-[#8A8AA0]"
            }`}
          >
            {source === "typesense" ? "Typesense" : "Catalog fallback"}
          </span>
        ) : null}
      </div>

      {!typesenseReady ? (
        <p className="rounded-lg border border-white/10 bg-[#0A0A10] px-4 py-3 text-sm text-[#8A8AA0]">
          Typesense is not configured — search uses the live Medusa catalog. Set{" "}
          <code className="text-[#5EEAD4]">TYPESENSE_HOST</code> and{" "}
          <code className="text-[#5EEAD4]">TYPESENSE_API_KEY</code>, then run{" "}
          <code className="text-[#5EEAD4]">npm run typesense:index</code> for faster fuzzy matching.
        </p>
      ) : null}

      {q && results.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#0A0A10] p-6 text-sm text-[#8A8AA0]">
          <p>No matches found. Try a CAS number, partial name, or browse the full catalog.</p>
          <Link href="/shop" className="mt-3 inline-block text-[#5EEAD4] hover:underline">
            Browse all products
          </Link>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
