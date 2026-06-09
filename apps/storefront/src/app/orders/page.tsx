import { OrdersList } from "@/components/orders-list"

export default function OrdersPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Order History</h1>
      <p className="text-[#8A8AA0]">
        Signed-in customers see Medusa orders. Guest checkouts are stored locally until you sign in.
      </p>
      <OrdersList />
    </section>
  )
}
