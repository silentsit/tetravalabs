"use client"

import dynamic from "next/dynamic"

function noopWidget() {
  return null
}

const SocialProofToast = dynamic(
  () =>
    import("@/components/social-proof-widget")
      .then((mod) => mod.SocialProofToast)
      .catch(() => noopWidget),
  { ssr: false }
)
const AiChatWidget = dynamic(
  () =>
    import("@/components/ai-chat-widget")
      .then((mod) => mod.AiChatWidget)
      .catch(() => noopWidget),
  { ssr: false }
)

export function DeferredChrome() {
  return (
    <>
      <SocialProofToast />
      <AiChatWidget />
    </>
  )
}
