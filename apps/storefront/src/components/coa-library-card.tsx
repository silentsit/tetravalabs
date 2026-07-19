import Image from "next/image"
import Link from "next/link"
import { Download, FileText } from "lucide-react"
import { CoaPdfPreview } from "@/components/coa-pdf-preview"
import {
  formatCoaCompound,
  formatCoaStrength,
  getCoaCardPreviewUrl,
  isCoaPdfPreviewUrl
} from "@/lib/coa-display"
import type { StoreCoaDocument } from "@/lib/medusa"

type Props = {
  document: StoreCoaDocument
}

export function CoaLibraryCard({ document }: Props) {
  const strength = formatCoaStrength(document)
  const compound = formatCoaCompound(document)
  const thumbnailUrl = getCoaCardPreviewUrl(document)
  const pdfUrl = document.document_url

  const preview = (
    <>
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={`COA batch ${document.batch_number}`}
          fill
          unoptimized
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain object-top p-1 transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : pdfUrl && isCoaPdfPreviewUrl(pdfUrl) ? (
        <CoaPdfPreview
          url={pdfUrl}
          alt={`COA batch ${document.batch_number}`}
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : pdfUrl ? (
        <Image
          src={pdfUrl}
          alt={`COA batch ${document.batch_number}`}
          fill
          unoptimized
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 text-[#94A3B8]">
          <FileText className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase tracking-wide">Preview unavailable</span>
        </div>
      )}
      <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#0D9488] shadow-sm backdrop-blur">
        {document.document_type}
      </span>
    </>
  )

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      {pdfUrl ? (
        <Link
          href={pdfUrl}
          prefetch={false}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-[4/5] max-h-[200px] overflow-hidden bg-[#F8FAFC]"
          aria-label={`Open COA PDF for ${compound} batch ${document.batch_number}`}
        >
          {preview}
        </Link>
      ) : (
        <div className="relative aspect-[4/5] max-h-[200px] overflow-hidden bg-[#F8FAFC]">{preview}</div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-3">
        <div>
          <h2 className="font-serif text-base leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {compound}
            {strength ? ` ${strength}` : ""}
          </h2>
          <p className="mt-0.5 text-xs text-[#64748B]">Batch {document.batch_number}</p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748B]">
          {document.purity_percent != null ? (
            <span className="rounded bg-[#CCFBF1] px-2 py-0.5 font-medium text-[#0D9488]">
              {document.purity_percent}% purity
            </span>
          ) : null}
          {document.tested_at ? (
            <span>Tested {new Date(document.tested_at).toLocaleDateString()}</span>
          ) : null}
        </div>

        {pdfUrl ? (
          <Link
            href={pdfUrl}
            prefetch={false}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#0D9488] hover:text-[#0F766E]"
          >
            <Download className="h-3.5 w-3.5" />
            Open full PDF
          </Link>
        ) : null}
      </div>
    </article>
  )
}
