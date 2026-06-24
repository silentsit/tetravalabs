import type { Metadata } from "next"
import { AccountDetailsForm } from "@/components/account/account-details-form"
import { AccountPageHeader } from "@/components/account/account-page-header"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Account details",
  description: "Edit your Tetrava Labs account profile and password settings.",
  path: "/account/details",
  noIndex: true
})

export default function AccountDetailsPage() {
  return (
    <>
      <AccountPageHeader
        title="Account details"
        description="Update your profile information and request a password reset."
      />
      <AccountDetailsForm />
    </>
  )
}
