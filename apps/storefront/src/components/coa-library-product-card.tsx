import Image from "next/image"
import Link from "next/link"
import { FileText } from "lucide-react"
import { getCoaCardPreviewUrl } from "@/lib/coa-display"
import {
  coaLibraryProductPath,
  type CoaLibraryProduct
} from "@/lib/coa-library"

type Props = {
  product: CoaLibraryProduct
}

export function CoaLibraryProductCard({ product }: Props) {
  const href = coaLibraryProductPath(product.parentHandle)
  const thumb = product.previewDocument
    ? getCoaCardPreviewUrl(product.previewDocument)
    : null
  const imageSrc = thumb || product.image

  return (
    <article className="card card-hover group flex h-full min-w-0 flex-col overflow-hidden">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-[#F8FAFC]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.displayName}
              fill
              unoptimized
              loading="lazy"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1.5 text-[#94A3B8]">
              <FileText className="h-8 w-8" />
              <span className="text-[10px] font-medium uppercase tracking-wide">No preview</span>
            </div>
          )}
          <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#0D9488] shadow-sm backdrop-blur">
            {product.documentCount} COA{product.documentCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <h2 className="font-serif text-base leading-snug text-[#0F172A] transition-colors group-hover:text-[#0D9488]">
            {product.displayName}
          </h2>
          {product.strengthLabels.length > 1 ? (
            <p className="text-xs text-[#64748B]">
              {product.strengthLabels.length} strengths with lot documents
            </p>
          ) : product.strengthLabels[0] && product.strengthLabels[0] !== "Standard" ? (
            <p className="text-xs text-[#64748B]">Strength {product.strengthLabels[0]}</p>
          ) : (
            <p className="text-xs text-[#64748B]">Lot-linked certificates</p>
          )}
          <span className="mt-auto text-xs font-medium text-[#0D9488]">View COAs →</span>
        </div>
      </Link>
    </article>
  )
}
