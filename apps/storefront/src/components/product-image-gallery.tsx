"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import type { StoreCoaDocument } from "@/lib/medusa"
import { coaViewerUrl } from "@/lib/medusa"
import { CoaPdfPreview } from "@/components/coa-pdf-preview"
import { getCoaCardPreviewUrl } from "@/lib/coa-display"
import { ProductImageZoom } from "@/components/product-image-zoom"

type GalleryItem = {
  id: string
  label: string
  kind: "product" | "coa"
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

  if (isImageUrl(doc.document_url)) return doc.document_url
  return undefined
}

function buildGalleryItems(
  productImages: string[],
  productName: string,
  coas: StoreCoaDocument[]
): GalleryItem[] {
  const items: GalleryItem[] = productImages.filter(Boolean).map((src, index) => ({
    id: index === 0 ? "product-front" : `product-${index}`,
    label: index === 0 ? productName : `${productName} (side)`,
    kind: "product" as const,
    src
  }))

  if (!items.length) {
    items.push({
      id: "product-front",
      label: productName,
      kind: "product",
      src: "/v2/vial-single.jpg"
    })
  }

  const coaDocs = coas.filter((doc) => doc.document_type === "coa" && doc.document_url)

  for (const doc of coaDocs.slice(0, 4)) {
    const previewUrl = getCoaPreviewSrc(doc)
    const pdfUrl = coaViewerUrl(doc.id)

    items.push({
      id: doc.id,
      label: `COA batch ${doc.batch_number}`,
      kind: "coa",
      src: previewUrl || pdfUrl,
      previewUrl,
      pdfUrl
    })
  }

  return items
}

function GalleryMain({ item }: { item: GalleryItem }) {
  if (item.kind === "coa") {
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

      {items.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            const selected = item.id === activeId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveId(item.id)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-colors ${
                  selected
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
      ) : null}
    </div>
  )
}
