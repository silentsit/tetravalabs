"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { CoaLibraryCard } from "@/components/coa-library-card"
import { formatCoaSearchText } from "@/lib/coa-display"
import type { StoreCoaDocument } from "@/lib/medusa"

type Props = {
  documents: StoreCoaDocument[]
}

export function CoaLibraryList({ documents }: Props) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return documents
    return documents.filter((doc) => formatCoaSearchText(doc).toLowerCase().includes(q))
  }, [documents, search])

  return (
    <div className="page-container py-8">
      <span className="section-label">Quality</span>
      <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">COA Library</h1>
      <p className="mt-4 max-w-2xl text-[#475569]">
        Browse lot-linked Certificates of Analysis with live document previews. Open any card to view
        the full PDF.
      </p>

      <div className="relative mt-8 max-w-xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by compound, strength, batch, or document type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {documents.length === 0 ? (
        <p className="mt-10 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center text-[#475569]">
          No COA documents are available yet. Run{" "}
          <code className="rounded bg-white px-1.5 py-0.5 text-sm">npm run coa:sync-r2</code> against
          production Medusa/R2, then redeploy.
        </p>
      ) : null}

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((doc) => (
            <CoaLibraryCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : null}

      {documents.length > 0 && filtered.length === 0 ? (
        <p className="mt-10 text-center text-[#475569]">No documents found matching your search.</p>
      ) : null}
    </div>
  )
}
