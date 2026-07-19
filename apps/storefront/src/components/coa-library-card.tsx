import Image from "next/image"
import Link from "next/link"
import { Download, FileText } from "lucide-react"
import { CoaPdfPreview } from "@/components/coa-pdf-preview"
import {
  formatCoaCompound,
  formatCoaStrength,
  isCoaPdfPreviewUrl
} from "@/lib/coa-display"
import type { StoreCoaDocument } from "@/lib/medusa"

type Props = {
  document: StoreCoaDocument
}

export function CoaLibraryCard({ document }: Props) {
  const strength = formatCoaStrength(document)
  const compound = formatCoaCompound(document)
  const previewUrl = document.document_url

  const preview = (
    <>
      {previewUrl && isCoaPdfPreviewUrl(previewUrl) ? (
        <CoaPdfPreview
          url={previewUrl}
          alt={`COA batch ${document.batch_number}`}
          scale={0.52}
          className="h-full w-full object-contain object-top transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : previewUrl ? (
        <Image
          src={previewUrl}
          alt={`COA batch ${document.batch_number}`}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-[#94A3B8]">
          <FileText className="h-8 w-8" />
          <span className="text-xs font-medium uppercase tracking-wide">Preview unavailable</span>
        </div>
      )}
      <span className="absolute left-3 top-3 rounded bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#0D9488] shadow-sm backdrop-blur">
        {document.document_type}
      </span>
    </>
  )

  return (
    <article className="card card-hover group flex flex-col overflow-hidden">
      {previewUrl ? (
        <Link
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="relative block aspect-[3/4] overflow-hidden bg-[#F8FAFC]"
          aria-label={`Open COA for ${compound} batch ${document.batch_number}`}
        >
          {preview}
        </Link>
      ) : (
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F8FAFC]">{preview}</div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h2 className="font-serif text-lg leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {compound}
            {strength ? ` ${strength}` : ""}
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">Batch {document.batch_number}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          {document.purity_percent != null ? (
            <span className="rounded bg-[#CCFBF1] px-2 py-0.5 font-medium text-[#0D9488]">
              {document.purity_percent}% purity
            </span>
          ) : null}
          {document.tested_at ? (
            <span>Tested {new Date(document.tested_at).toLocaleDateString()}</span>
          ) : null}
        </div>

        {previewUrl ? (
          <Link
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[#0D9488] hover:text-[#0F766E]"
          >
            <Download className="h-4 w-4" />
            Open full PDF
          </Link>
        ) : null}
      </div>
    </article>
  )
}
