"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell, MapPin, ShoppingBag } from "lucide-react"
import { AccountEmptyNotice } from "@/components/account/account-empty-notice"
import { PurchaseHistory } from "@/components/purchase-history"
import { sdk } from "@/lib/medusa-client"
import { formatCustomerName, listCustomerAddresses, retrieveCustomer } from "@/lib/medusa-auth"

export function AccountDashboardHome() {
  const [name, setName] = useState("")
  const [orderCount, setOrderCount] = useState<number | null>(null)
  const [addressCount, setAddressCount] = useState<number | null>(null)

  useEffect(() => {
    void (async () => {
      const customer = await retrieveCustomer()
      if (customer) setName(formatCustomerName(customer))

      try {
        const { orders, count } = await sdk.store.order.list({ limit: 1, fields: "id" })
        setOrderCount(count ?? orders?.length ?? 0)
      } catch {
        setOrderCount(0)
      }

      try {
        const addresses = await listCustomerAddresses()
        setAddressCount(addresses.length)
      } catch {
        setAddressCount(0)
      }
    })()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-[#475569]">
          Hello <span className="font-medium text-[#0F172A]">{name || "there"}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          From your account dashboard you can view recent orders, manage shipping and billing
          addresses, download COA documents, and edit your account details.
        </p>
      </div>

      <div className="space-y-4">
        {orderCount !== null && orderCount === 0 ? (
          <AccountEmptyNotice
            icon={Bell}
            message="No order has been made yet."
            actionLabel="Browse products"
            actionHref="/shop"
          />
        ) : null}

        {addressCount !== null && addressCount === 0 ? (
          <AccountEmptyNotice
            icon={MapPin}
            message="You have not set up any addresses yet."
            actionLabel="Add address"
            actionHref="/account/addresses"
          />
        ) : null}
      </div>

      {orderCount && orderCount > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-medium text-[#0F172A]">
              <ShoppingBag className="h-5 w-5 text-[#0D9488]" aria-hidden />
              Recent orders
            </h2>
            <Link href="/account/orders" className="text-xs text-[#0D9488] hover:underline">
              View all
            </Link>
          </div>
          <PurchaseHistory limit={5} compact showHeading={false} accountOrdersHref="/account/orders" />
        </div>
      ) : null}
    </div>
  )
}
