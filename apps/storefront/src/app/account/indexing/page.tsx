import type { Metadata } from "next"
import { IndexNowSubmitPanel } from "@/components/account/indexnow-submit-panel"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Indexing",
  description: "Submit Tetrava Labs sitemap URLs to search engines via IndexNow.",
  path: "/account/indexing",
  noIndex: true
})

export default function AccountIndexingPage() {
  return (
    <>
      <AccountPageHeader
        title="Indexing"
        description="Submit the live sitemap to IndexNow. Search Console ping runs when a service account is set."
      />
      <IndexNowSubmitPanel />
    </>
  )
}
