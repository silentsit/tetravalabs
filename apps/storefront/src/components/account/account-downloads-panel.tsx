"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Download, FileText } from "lucide-react"
import { AccountEmptyNotice } from "@/components/account/account-empty-notice"
import { sdk } from "@/lib/medusa-client"

type OrderItem = {
  id?: string
  title?: string
  product?: { handle?: string; title?: string } | null
  variant?: { title?: string } | null
}

type DownloadRow = {
  key: string
  label: string
  handle?: string
}

export function AccountDownloadsPanel() {
  const [rows, setRows] = useState<DownloadRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const { orders } = await sdk.store.order.list({
          limit: 50,
          fields: "*items,*items.product,*items.variant"
        })

        const seen = new Map<string, DownloadRow>()
        for (const order of orders || []) {
          for (const item of (order.items || []) as OrderItem[]) {
            const handle = item.product?.handle
            const label = item.product?.title || item.title || "Product"
            const key = handle || item.id || label
            if (!seen.has(key)) {
              seen.set(key, { key, label, handle })
            }
          }
        }
        setRows(Array.from(seen.values()))
      } catch {
        setRows([])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const sortedRows = useMemo(
    () => [...rows].sort((a, b) => a.label.localeCompare(b.label)),
    [rows]
  )

  if (loading) {
    return <p className="text-sm text-[#475569]">Loading downloads...</p>
  }

  if (!sortedRows.length) {
    return (
      <div className="space-y-4">
        <AccountEmptyNotice
          icon={Download}
          message="No downloadable documents are available for your orders yet."
          actionLabel="Browse products"
          actionHref="/shop"
        />
        <p className="text-sm text-[#475569]">
          Batch COA and HPLC documents for purchased peptides appear here after checkout. You
          can also browse the public{" "}
          <Link href="/coa-library" className="text-[#0D9488] hover:underline">
            COA library
          </Link>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#475569]">
        Certificates of analysis and related documents for products in your order history.
      </p>
      <ul className="divide-y divide-[#E2E8F0] overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
        {sortedRows.map((row) => (
          <li key={row.key} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[#0D9488]" aria-hidden />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">{row.label}</p>
                <p className="text-xs text-[#64748B]">COA / batch documentation</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {row.handle ? (
                <>
                  <Link href={`/product/${row.handle}`} className="btn-secondary px-4 py-2 text-xs">
                    View product
                  </Link>
                  <Link
                    href={`/coa-library?product=${encodeURIComponent(row.handle)}`}
                    className="btn-primary px-4 py-2 text-xs"
                  >
                    Open COA
                  </Link>
                </>
              ) : (
                <Link href="/coa-library" className="btn-primary px-4 py-2 text-xs">
                  COA library
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
