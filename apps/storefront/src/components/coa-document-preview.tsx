import Image from "next/image"
import Link from "next/link"
import { FileText } from "lucide-react"
import { formatCoaCompound, formatCoaStrength } from "@/lib/coa-display"
import type { StoreCoaDocument } from "@/lib/medusa"

type Props = {
  document: StoreCoaDocument
  compact?: boolean
}

function isPdfPreviewUrl(url: string) {
  return (
    /\.pdf(\?|$)/i.test(url) ||
    url.includes("/file") ||
    url.startsWith("/api/coa-file")
  )
}

export function CoaDocumentPreview({ document, compact = false }: Props) {
  const previewHeight = compact ? "h-48" : "h-72"
  const strength = formatCoaStrength(document)

  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className={`relative ${previewHeight} bg-[#F1F5F9]`}>
        {document.document_url && isPdfPreviewUrl(document.document_url) ? (
          <iframe
            title={`COA preview batch ${document.batch_number}`}
            src={`${document.document_url}#toolbar=0&navpanes=0`}
            className="h-full w-full border-0"
          />
        ) : document.document_url ? (
          <Image
            src={document.document_url}
            alt={`COA batch ${document.batch_number}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-2"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">
            <FileText className="mr-2 h-5 w-5" />
            Preview unavailable
          </div>
        )}
      </div>
      <div className="space-y-2 border-t border-[#E2E8F0] p-4">
        <p className="text-sm font-medium text-[#0F172A]">
          {strength
            ? `${formatCoaCompound(document)} ${strength} — Batch ${document.batch_number}`
            : `${formatCoaCompound(document)} — Batch ${document.batch_number}`}
        </p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <span className="rounded bg-[#CCFBF1] px-2 py-0.5 text-[#0D9488]">
            {document.document_type.toUpperCase()}
          </span>
          {document.purity_percent != null ? <span>{document.purity_percent}% purity</span> : null}
          {document.tested_at ? (
            <span>Tested {new Date(document.tested_at).toLocaleDateString()}</span>
          ) : null}
        </div>
        {document.document_url ? (
          <Link
            href={document.document_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-sm text-[#0D9488] hover:underline"
          >
            Open full document
          </Link>
        ) : null}
      </div>
    </div>
  )
}
