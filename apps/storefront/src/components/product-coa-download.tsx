"use client"

import { Download } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"
import { formatCoaStrength } from "@/lib/coa-display"

type Props = {
  coas: StoreCoaDocument[]
}

export function ProductCoaDownload({ coas }: Props) {
  const primary = coas.find((doc) => doc.document_type === "coa" && doc.document_url) || coas[0]
  const strength = primary ? formatCoaStrength(primary) : null
  const extraCount = Math.max(0, coas.filter((doc) => doc.document_url).length - 1)

  if (!primary?.document_url) {
    return (
      <div className="rounded-lg border border-dashed border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
        <p className="text-xs font-medium text-[#475569]">Certificate of Analysis</p>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          Lot-linked COA not published yet for this variant.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <a
        href={primary.document_url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-medium text-[#0F172A] transition-colors hover:border-[#0D9488] hover:text-[#0D9488]"
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden />
        Download COA (PDF)
      </a>
      <p className="text-center text-xs text-[#64748B]">
        Batch {primary.batch_number}
        {strength ? ` · ${strength}` : ""}
        {primary.purity_percent != null ? ` · ${primary.purity_percent}% purity` : ""}
        {extraCount > 0 ? ` · +${extraCount} more lot${extraCount === 1 ? "" : "s"}` : ""}
      </p>
      {extraCount > 0 ? (
        <ul className="space-y-1 text-xs text-[#64748B]">
          {coas
            .filter((doc) => doc.id !== primary.id && doc.document_url)
            .map((doc) => (
              <li key={doc.id} className="flex justify-between gap-2">
                <span>
                  Batch {doc.batch_number} — {doc.document_type.toUpperCase()}
                </span>
                <a
                  href={doc.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-[#0D9488] hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  )
}
