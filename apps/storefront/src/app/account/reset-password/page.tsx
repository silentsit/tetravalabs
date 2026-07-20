import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/account/reset-password-form"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Reset Password",
  description: "Set a new password for your Tetrava Labs account.",
  path: "/account/reset-password",
  noIndex: true
})

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
