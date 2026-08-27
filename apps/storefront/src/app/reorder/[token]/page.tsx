import type { Metadata } from "next"
import { ReorderTokenClient } from "@/components/reorder-token-client"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Reorder",
  description: "Reload a previous Tetrava Labs research order from your secure email link.",
  path: "/reorder",
  noIndex: true
})

type Props = {
  params: Promise<{ token: string }>
}

export default async function ReorderTokenPage({ params }: Props) {
  const { token } = await params
  return <ReorderTokenClient token={decodeURIComponent(token)} />
}
