"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CoaLibraryProductCard } from "@/components/coa-library-product-card"
import {
  formatCoaLibrarySearchText,
  type CoaLibraryProduct
} from "@/lib/coa-library"

type Props = {
  products: CoaLibraryProduct[]
}

export function CoaLibraryList({ products }: Props) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) =>
      formatCoaLibrarySearchText(product).toLowerCase().includes(q)
    )
  }, [products, search])

  return (
    <div className="page-container space-y-8 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "COA Library" }]} />
      <div>
        <span className="section-label">Quality</span>
        <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">COA Library</h1>
        <p className="mt-4 max-w-2xl text-[#475569]">
          Browse lot-linked Certificates of Analysis by product — Novagen verified.
        </p>
      </div>

      <div className="relative mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by product, strength, batch, or document type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center text-[#475569]">
          No COA documents are available yet. Run{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">npm run coa:sync-r2</code> against
          production Medusa/R2, then redeploy.
        </p>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((product) => (
            <CoaLibraryProductCard key={product.parentHandle} product={product} />
          ))}
        </div>
      ) : null}

      {products.length > 0 && filtered.length === 0 ? (
        <p className="mt-10 text-center text-[#475569]">No products found matching your search.</p>
      ) : null}
    </div>
  )
}
