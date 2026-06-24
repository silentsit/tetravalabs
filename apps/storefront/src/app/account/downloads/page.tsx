import type { Metadata } from "next"
import { AccountDownloadsPanel } from "@/components/account/account-downloads-panel"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Downloads",
  description: "Access COA and batch documents for your Tetrava Labs orders.",
  path: "/account/downloads",
  noIndex: true
})

export default function AccountDownloadsPage() {
  return (
    <>
      <AccountPageHeader
        title="Downloads"
        description="Batch COA and HPLC documents for products you have purchased."
      />
      <AccountDownloadsPanel />
    </>
  )
}
