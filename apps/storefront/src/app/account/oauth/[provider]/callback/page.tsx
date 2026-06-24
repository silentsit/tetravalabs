import { Suspense } from "react"
import { OAuthCallbackClient } from "@/components/oauth-callback-client"
import { AccountPageHeader } from "@/components/account/account-page-header"
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
    return <p className="text-sm text-red-600">Unsupported sign-in provider.</p>
  }

  return (
    <>
      <AccountPageHeader title="Sign in" description="Completing your secure sign-in request." />
      <Suspense fallback={<p className="text-sm text-[#475569]">Completing sign-in...</p>}>
        <OAuthCallbackClient provider={provider} />
      </Suspense>
    </>
  )
}
