"use client"

import { Bell } from "lucide-react"
import { AccountEmptyNotice } from "@/components/account/account-empty-notice"
import { OrdersList } from "@/components/orders-list"

export function AccountOrdersPanel() {
  return (
    <div className="space-y-6">
      <OrdersList
        emptyState={
          <AccountEmptyNotice
            icon={Bell}
            message="No order has been made yet."
            actionLabel="Browse products"
            actionHref="/shop"
          />
        }
        showGuestLookup={false}
      />
    </div>
  )
}
