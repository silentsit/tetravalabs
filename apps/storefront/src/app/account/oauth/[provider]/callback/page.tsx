import { Suspense } from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { OAuthCallbackClient } from "@/components/oauth-callback-client"
import type { SocialAuthProvider } from "@/lib/social-auth-config"

type Props = {
  params: Promise<{ provider: string }>
}

function isProvider(value: string): value is SocialAuthProvider {
  return value === "google" || value === "apple"
}

export default async function OAuthCallbackPage({ params }: Props) {
  const { provider } = await params

  if (!isProvider(provider)) {
    return (
      <section className="page-container py-8">
        <p className="text-sm text-red-600">Unsupported sign-in provider.</p>
      </section>
    )
  }

  return (
    <section className="page-container py-8 sm:py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account", href: "/account" }, { label: "Sign in" }]} />
      <Suspense fallback={<p className="text-sm text-[#475569]">Completing sign-in...</p>}>
        <OAuthCallbackClient provider={provider} />
      </Suspense>
    </section>
  )
}
