"use client"

import dynamic from "next/dynamic"

const SocialProofToast = dynamic(
  () => import("@/components/social-proof-widget").then((mod) => mod.SocialProofToast),
  { ssr: false }
)
const AiChatWidget = dynamic(
  () => import("@/components/ai-chat-widget").then((mod) => mod.AiChatWidget),
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
