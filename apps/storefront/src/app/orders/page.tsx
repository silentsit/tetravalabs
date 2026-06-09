import { OrdersList } from "@/components/orders-list"

type Props = {
  searchParams: Promise<{ payment?: string }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const { payment } = await searchParams

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Order History</h1>
      {payment === "complete" ? (
        <p className="rounded-lg border border-[#5EEAD4]/30 bg-[#5EEAD4]/10 px-4 py-3 text-sm text-[#5EEAD4]">
          Payment received — thank you. Fulfillment will begin once the transaction is confirmed.
        </p>
      ) : null}
      <p className="text-[#8A8AA0]">
        Signed-in customers see Medusa orders. Guest checkouts are stored locally until you sign in.
      </p>
      <OrdersList />
    </section>
  )
}
