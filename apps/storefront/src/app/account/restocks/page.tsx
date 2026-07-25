import type { Metadata } from "next"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { AccountRestocksPanel } from "@/components/account/account-restocks-panel"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Peptide Refills",
  description: "Manage your Tetrava Labs Peptide Refill schedules.",
  path: "/account/restocks",
  noIndex: true
})

export default function AccountRestocksPage() {
  return (
    <>
      <AccountPageHeader
        title="Peptide Refills"
        description="Skip, pause, cancel, or change cadence for scheduled research compound refills."
      />
      <AccountRestocksPanel />
    </>
  )
}
