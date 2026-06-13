"use client"

import { useMemo, useState } from "react"
import { Beaker, Download, Search } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"

type Props = {
  documents: StoreCoaDocument[]
}

export function CoaLibraryList({ documents }: Props) {
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return documents
    return documents.filter((doc) =>
      [doc.batch_number, doc.document_type, doc.variant_id, String(doc.metadata?.compound || "")]
        .join(" ")
        .toLowerCase()
        .includes(q)
    )
  }, [documents, search])

  return (
    <div className="page-container max-w-5xl py-8">
      <span className="section-label">Quality</span>
      <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">COA Library</h1>
      <p className="mt-4 max-w-2xl text-[#475569]">
        Batch-level COA and HPLC documents from our lab database. Links resolve to public or signed file
        URLs when R2 is configured.
      </p>

      <div className="relative mt-8">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search by batch number or document type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col gap-4 rounded-xl border border-[#E2E8F0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#CCFBF1]">
                <Beaker className="h-6 w-6 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-[#0F172A]">
                  {doc.metadata?.compound ? String(doc.metadata.compound) : "Research compound"} — Batch{" "}
                  {doc.batch_number} ({doc.document_type.toUpperCase()})
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
                  {doc.purity_percent != null ? (
                    <span className="rounded bg-[#CCFBF1] px-1.5 py-0.5 text-[#0D9488]">
                      {doc.purity_percent}% purity
                    </span>
                  ) : null}
                  {doc.tested_at ? <span>Tested {new Date(doc.tested_at).toLocaleDateString()}</span> : null}
                </div>
              </div>
            </div>
            {doc.document_url ? (
              <a
                href={doc.document_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#475569] transition-colors hover:border-[#0D9488] hover:text-[#0D9488]"
              >
                <Download className="h-4 w-4" /> View document
              </a>
            ) : null}
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-[#475569]">No documents found matching your search.</p>
      ) : null}
    </div>
  )
}
