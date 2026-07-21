"use client"

import Image from "next/image"
import { FileText } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { StoreCoaDocument } from "@/lib/medusa"
import { coaViewerUrl, coaPreviewUrl } from "@/lib/medusa"
import { CoaPdfPreview } from "@/components/coa-pdf-preview"
import { getCoaCardPreviewUrl } from "@/lib/coa-display"
import { ProductImageZoom } from "@/components/product-image-zoom"

type GalleryItem = {
  id: string
  label: string
  kind: "product" | "coa" | "coa-unavailable"
  src: string
  pdfUrl?: string
  previewUrl?: string
}

type Props = {
  /** @deprecated Prefer productImages — kept for single-image callers. */
  productImage?: string
  productImages?: string[]
  productName: string
  coas?: StoreCoaDocument[]
}

function isImageUrl(url: string) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url) || url.includes("/api/coa-preview")
}

function getCoaPreviewSrc(doc: StoreCoaDocument): string | undefined {
  const previewUrl = getCoaCardPreviewUrl(doc)
  if (previewUrl) return previewUrl

  const metadata = doc.metadata || {}
  if (typeof metadata.preview_storage_key === "string" && metadata.preview_storage_key.trim()) {
    return coaPreviewUrl(doc.id)
  }

  if (isImageUrl(doc.document_url)) return doc.document_url
  return undefined
}

function buildGalleryItems(
  productImages: string[],
  productName: string,
  coas: StoreCoaDocument[]
): GalleryItem[] {
  const images = productImages.filter(Boolean)
  const front = images[0] || "/v2/vial-single.jpg"
  const side = images[1] || front

  const items: GalleryItem[] = [
    {
      id: "product-front",
      label: productName,
      kind: "product",
      src: front
    },
    {
      id: "product-side",
      label: `${productName} (side)`,
      kind: "product",
      src: side
    }
  ]

  const primaryCoa = coas.find((doc) => doc.document_type === "coa" && doc.document_url)
  if (primaryCoa) {
    const previewUrl = getCoaPreviewSrc(primaryCoa)
    const pdfUrl = coaViewerUrl(primaryCoa.id)

    items.push({
      id: primaryCoa.id,
      label: `COA batch ${primaryCoa.batch_number}`,
      kind: "coa",
      src: previewUrl || pdfUrl,
      previewUrl,
      pdfUrl
    })
  } else {
    items.push({
      id: "coa-unavailable",
      label: "Certificate of Analysis",
      kind: "coa-unavailable",
      src: ""
    })
  }

  return items
}

function GalleryMain({ item }: { item: GalleryItem }) {
  if (item.kind === "coa-unavailable") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#F8FAFC] p-6 text-center">
        <FileText className="h-10 w-10 text-[#94A3B8]" aria-hidden />
        <p className="text-sm font-medium text-[#475569]">COA preview not available yet</p>
        <p className="text-xs text-[#94A3B8]">Check the COA tab for batch documents when published.</p>
      </div>
    )
  }

  if (item.kind === "coa") {
    // Prefer PDF render for the large gallery pane — card JPEG previews are ~480px
    // and look soft when upscaled. Keep JPEG for thumbnails only.
    if (item.pdfUrl) {
      return (
        <div className="flex h-full w-full items-start justify-center overflow-auto bg-white p-2">
          <CoaPdfPreview
            url={item.pdfUrl}
            alt={item.label}
            scale={1.1}
            lazy={false}
            className="max-h-full w-auto"
          />
        </div>
      )
    }

    if (item.previewUrl) {
      return (
        <div className="relative h-full w-full bg-white">
          <Image
            src={item.previewUrl}
            alt={item.label}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain object-top p-2"
          />
        </div>
      )
    }
  }

  if (item.kind === "product") {
    return <ProductImageZoom src={item.src} alt={item.label} priority />
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={item.src}
        alt={item.label}
        fill
        unoptimized={item.src.startsWith("http")}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-4"
      />
    </div>
  )
}

function GalleryThumb({ item }: { item: GalleryItem }) {
  if (item.kind === "coa-unavailable") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-[#F8FAFC] text-[#94A3B8]">
        <FileText className="h-4 w-4" aria-hidden />
        <span className="text-[9px] font-medium uppercase tracking-wide">COA</span>
      </div>
    )
  }

  if (item.kind === "product") {
    return (
      <Image
        src={item.src}
        alt=""
        fill
        sizes="64px"
        className="object-contain p-1.5"
        aria-hidden
      />
    )
  }

  if (item.previewUrl) {
    return (
      <Image
        src={item.previewUrl}
        alt=""
        fill
        unoptimized
        sizes="64px"
        className="object-contain object-top p-0.5"
        aria-hidden
      />
    )
  }

  if (item.pdfUrl) {
    return (
      <CoaPdfPreview
        url={item.pdfUrl}
        alt={item.label}
        scale={0.12}
        className="pointer-events-none object-cover object-top"
      />
    )
  }

  return (
    <Image
      src={item.src}
      alt=""
      fill
      unoptimized={item.src.startsWith("http")}
      sizes="64px"
      className="object-contain object-top p-0.5"
      aria-hidden
    />
  )
}

export function ProductImageGallery({
  productImage,
  productImages,
  productName,
  coas = []
}: Props) {
  const items = useMemo(() => {
    const images = productImages?.length ? productImages : productImage ? [productImage] : []
    return buildGalleryItems(images, productName, coas)
  }, [productImage, productImages, productName, coas])
  const [activeId, setActiveId] = useState(items[0]?.id ?? "product-front")

  useEffect(() => {
    setActiveId(items[0]?.id ?? "product-front")
  }, [items])

  const active = items.find((item) => item.id === activeId) ?? items[0]

  if (!active) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="product-detail-image-wrapper product-detail-image-wrapper-compact">
        <GalleryMain item={active} />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {items.map((item) => {
          const selected = item.id === activeId
          const disabled = item.kind === "coa-unavailable"
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!disabled) setActiveId(item.id)
              }}
              disabled={disabled}
              className={`relative h-16 w-full overflow-hidden rounded-lg border bg-white transition-colors ${
                disabled
                  ? "cursor-not-allowed border-[#E2E8F0] opacity-70"
                  : selected
                    ? "border-[#0D9488] ring-2 ring-[#0D9488]/20"
                    : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
              aria-label={item.label}
              aria-pressed={selected}
            >
              <GalleryThumb item={item} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
