"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import type { StoreCoaDocument } from "@/lib/medusa"
import { CoaPdfPreview } from "@/components/coa-pdf-preview"

type GalleryItem = {
  id: string
  label: string
  kind: "product" | "coa"
  src: string
  pdfProxyUrl?: string
}

type Props = {
  productImage: string
  productName: string
  coas?: StoreCoaDocument[]
}

function isPdfUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url) || url.includes("/file") || url.includes("/api/coa-file")
}

function isImageUrl(url: string) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url)
}

function getCoaPreviewSrc(doc: StoreCoaDocument): string | undefined {
  const meta = doc.metadata || {}
  const preview =
    (typeof meta.preview_image_url === "string" && meta.preview_image_url) ||
    (typeof meta.preview_url === "string" && meta.preview_url) ||
    (typeof meta.preview_image === "string" && meta.preview_image) ||
    undefined

  if (preview) return preview
  if (isImageUrl(doc.document_url)) return doc.document_url
  return undefined
}

function buildGalleryItems(
  productImage: string,
  productName: string,
  coas: StoreCoaDocument[]
): GalleryItem[] {
  const items: GalleryItem[] = [
    {
      id: "product",
      label: productName,
      kind: "product",
      src: productImage
    }
  ]

  const coaDocs = coas.filter((doc) => doc.document_type === "coa" && doc.document_url)

  for (const doc of coaDocs.slice(0, 4)) {
    const previewSrc = getCoaPreviewSrc(doc)
    const isPdf = !previewSrc && isPdfUrl(doc.document_url)

    items.push({
      id: doc.id,
      label: `COA batch ${doc.batch_number}`,
      kind: "coa",
      src: previewSrc || doc.document_url,
      pdfProxyUrl: isPdf ? `/api/coa-file?id=${encodeURIComponent(doc.id)}` : undefined
    })
  }

  return items
}

function GalleryMain({ item }: { item: GalleryItem }) {
  if (item.kind === "coa" && item.pdfProxyUrl) {
    return (
      <div className="flex h-full w-full items-start justify-center overflow-auto bg-white p-2">
        <CoaPdfPreview url={item.pdfProxyUrl} alt={item.label} scale={1.1} className="max-h-full w-auto" />
      </div>
    )
  }

  if (item.kind === "product") {
    return (
      <Image
        src={item.src}
        alt={item.label}
        fill
        priority
        sizes="(max-width: 1024px) 280px, 320px"
        className="object-contain p-4"
      />
    )
  }

  return <img src={item.src} alt={item.label} className="h-full w-full object-contain p-4" />
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

  if (item.pdfProxyUrl) {
    return (
      <CoaPdfPreview
        url={item.pdfProxyUrl}
        alt={item.label}
        scale={0.12}
        className="pointer-events-none object-cover object-top"
      />
    )
  }

  return <img src={item.src} alt="" className="h-full w-full object-contain object-top p-0.5" aria-hidden />
}

export function ProductImageGallery({ productImage, productName, coas = [] }: Props) {
  const items = useMemo(
    () => buildGalleryItems(productImage, productName, coas),
    [productImage, productName, coas]
  )
  const [activeId, setActiveId] = useState(items[0]?.id ?? "product")

  useEffect(() => {
    setActiveId(items[0]?.id ?? "product")
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
