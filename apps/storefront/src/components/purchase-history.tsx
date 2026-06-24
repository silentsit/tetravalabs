"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { sdk } from "@/lib/medusa-client"

type OrderItem = {
  id?: string
  title?: string
  quantity?: number
  product?: {
    handle?: string
    title?: string
  } | null
  variant?: {
    title?: string
  } | null
}

type PurchaseOrder = {
  id: string
  display_id?: number
  created_at?: string | Date
  total?: number
  currency_code?: string
  status?: string
  items?: OrderItem[] | null
}

type Props = {
  limit?: number
  compact?: boolean
  showHeading?: boolean
  accountOrdersHref?: string
}

function formatMoney(total: number, currencyCode?: string) {
  return `$${(total / 100).toFixed(2)} ${(currencyCode || "USD").toUpperCase()}`
}

export function PurchaseHistory({
  limit = 10,
  compact = false,
  showHeading = true,
  accountOrdersHref = "/orders"
}: Props) {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    void (async () => {
      try {
        const { orders: rows } = await sdk.store.order.list({
          limit,
          fields: "*items,*items.product,*items.variant"
        })
        setOrders((rows || []) as PurchaseOrder[])
      } catch {
        setError("Sign in to view purchase history linked to your account.")
      } finally {
        setLoading(false)
      }
    })()
  }, [limit])

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(String(b.created_at || 0)).getTime() -
          new Date(String(a.created_at || 0)).getTime()
      ),
    [orders]
  )

  if (loading) {
    return <p className="text-sm text-[#475569]">Loading purchase history...</p>
  }

  if (error) {
    return <p className="text-sm text-[#475569]">{error}</p>
  }

  if (!sortedOrders.length) {
    return (
      <div className="space-y-2">
        {showHeading ? <h3 className="text-lg text-[#0F172A]">Purchase history</h3> : null}
        <p className="text-sm text-[#475569]">No linked orders yet. Completed checkouts while signed in will appear here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showHeading ? (
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg text-[#0F172A]">Purchase history</h3>
          <Link href={accountOrdersHref} className="text-xs text-[#0D9488] hover:underline">
            View all orders
          </Link>
        </div>
      ) : null}

      <ul className="space-y-3">
        {sortedOrders.map((order) => (
          <li key={order.id} className="card p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Order {order.display_id ? `#${order.display_id}` : order.id}
                </p>
                <p className="mt-1 text-xs text-[#475569]">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
                  {order.status ? ` · ${order.status}` : ""}
                </p>
              </div>
              <p className="text-sm font-medium tabular-nums text-[#0F172A]">
                {formatMoney(order.total || 0, order.currency_code)}
              </p>
            </div>

            {order.items?.length ? (
              <ul className={`${compact ? "mt-3" : "mt-4"} space-y-2 border-t border-[#E2E8F0] pt-3`}>
                {order.items.map((item) => {
                  const handle = item.product?.handle
                  const label = item.product?.title || item.title || "Product"
                  const variant = item.variant?.title
                  const line = (
                    <>
                      {label}
                      {variant ? <span className="text-[#94A3B8]"> · {variant}</span> : null}
                      {item.quantity ? <span className="text-[#94A3B8]"> × {item.quantity}</span> : null}
                    </>
                  )

                  return (
                    <li key={item.id || `${order.id}-${label}`} className="text-sm text-[#475569]">
                      {handle ? (
                        <Link href={`/product/${handle}`} className="text-[#0F172A] hover:text-[#0D9488]">
                          {line}
                        </Link>
                      ) : (
                        line
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
