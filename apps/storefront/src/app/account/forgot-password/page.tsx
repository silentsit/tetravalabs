import { Suspense } from "react"
import { ForgotPasswordForm } from "@/components/account/forgot-password-form"
import { buildPageMetadata } from "@/lib/seo"

export const metadata = buildPageMetadata({
  title: "Forgot Password",
  description: "Request a secure password reset link for your Tetrava Labs account.",
  path: "/account/forgot-password",
  noIndex: true
})

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
      <ForgotPasswordForm />
    </Suspense>
  )
}
