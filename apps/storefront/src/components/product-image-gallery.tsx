"use client"

import { useMemo, useState } from "react"
import { FileText } from "lucide-react"
import type { StoreCoaDocument } from "@/lib/medusa"

type GalleryItem = {
  id: string
  label: string
  kind: "product" | "coa"
  src: string
  isPdf?: boolean
}

type Props = {
  productImage: string
  productName: string
  coas?: StoreCoaDocument[]
}

function isPdfUrl(url: string) {
  return /\.pdf(\?|$)/i.test(url) || url.includes("/file")
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

  for (const doc of coas.slice(0, 4)) {
    if (!doc.document_url) continue
    items.push({
      id: doc.id,
      label: `COA batch ${doc.batch_number}`,
      kind: "coa",
      src: doc.document_url,
      isPdf: isPdfUrl(doc.document_url)
    })
  }

  return items
}

function GalleryMain({ item }: { item: GalleryItem }) {
  if (item.kind === "coa" && item.isPdf) {
    return (
      <iframe
        title={item.label}
        src={`${item.src}#toolbar=0&navpanes=0`}
        className="h-full w-full border-0 bg-white"
      />
    )
  }

  return (
    <img
      src={item.src}
      alt={item.label}
      className="h-full w-full object-contain p-4"
    />
  )
}

function GalleryThumb({ item }: { item: GalleryItem }) {
  if (item.kind === "product") {
    return (
      <img
        src={item.src}
        alt=""
        className="h-full w-full object-contain p-1.5"
        aria-hidden
      />
    )
  }

  if (item.isPdf) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-1 bg-[#F8FAFC] p-1 text-[#64748B]">
        <FileText className="h-4 w-4" />
        <span className="text-[9px] font-medium uppercase tracking-wide">COA</span>
      </div>
    )
  }

  return (
    <img
      src={item.src}
      alt=""
      className="h-full w-full object-contain p-1"
      aria-hidden
    />
  )
}

export function ProductImageGallery({ productImage, productName, coas = [] }: Props) {
  const items = useMemo(
    () => buildGalleryItems(productImage, productName, coas),
    [productImage, productName, coas]
  )
  const [activeId, setActiveId] = useState(items[0]?.id ?? "product")
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
                className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-white transition-colors ${
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
