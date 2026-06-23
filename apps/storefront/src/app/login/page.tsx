import { redirect } from "next/navigation"

type Props = {
  searchParams: Promise<{ returnUrl?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams
  const returnUrl = params.returnUrl
  redirect(returnUrl ? `/account?returnUrl=${encodeURIComponent(returnUrl)}` : "/account")
}
