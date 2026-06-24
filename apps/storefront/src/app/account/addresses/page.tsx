import type { Metadata } from "next"
import { AccountAddressesPanel } from "@/components/account/account-addresses-panel"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Addresses",
  description: "Manage billing and shipping addresses for your Tetrava Labs account.",
  path: "/account/addresses",
  noIndex: true
})

export default function AccountAddressesPage() {
  return (
    <>
      <AccountPageHeader
        title="Addresses"
        description="Manage the addresses used by default during checkout."
      />
      <AccountAddressesPanel />
    </>
  )
}
