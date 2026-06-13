import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { SearchResultCard } from "@/components/search-result-card"
import { searchProducts } from "@/lib/search"
import { buildPageMetadata } from "@/lib/seo"

type Props = { searchParams: Promise<{ q?: string }> }

export const dynamic = "force-dynamic"

export const metadata: Metadata = buildPageMetadata({
  title: "Search research compounds",
  description: "Search the Tetrava Labs catalog by peptide name, CAS number, formula, or sequence.",
  path: "/search"
})

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams
  const { results, source } = await searchProducts(q)
  const typesenseReady = source === "typesense"

  return (
    <section className="page-container space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div>
        <span className="section-label">Catalog</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Search compounds</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569]">
          Find peptides and research materials by name, CAS number, molecular formula, or sequence.
        </p>
      </div>

      <form action="/search" className="max-w-xl">
        <div className="flex gap-2">
          <input name="q" defaultValue={q} placeholder="e.g. BPC-157, semaglutide, acetic" className="input-field" />
          <button type="submit" className="btn-primary shrink-0 px-5 py-2.5">
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[#475569]">
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
                ? "border-[#0D9488]/30 text-[#0D9488]"
                : "border-[#E2E8F0] text-[#94A3B8]"
            }`}
          >
            {source === "typesense" ? "Typesense" : "Catalog fallback"}
          </span>
        ) : null}
      </div>

      {!typesenseReady && q ? (
        <p className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#475569]">
          Search is using the live Medusa catalog. Typesense indexes automatically on Render after the
          next Medusa deploy.
        </p>
      ) : null}

      {q && results.length === 0 ? (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 text-sm text-[#475569]">
          <p>No matches found. Try a CAS number, partial name, or browse the full catalog.</p>
          <Link href="/shop" className="mt-3 inline-block text-[#0D9488] hover:underline">
            Browse all products
          </Link>
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
