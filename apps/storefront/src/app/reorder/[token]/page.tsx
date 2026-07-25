import { ReorderTokenClient } from "@/components/reorder-token-client"

type Props = {
  params: Promise<{ token: string }>
}

export default async function ReorderTokenPage({ params }: Props) {
  const { token } = await params
  return <ReorderTokenClient token={decodeURIComponent(token)} />
}
