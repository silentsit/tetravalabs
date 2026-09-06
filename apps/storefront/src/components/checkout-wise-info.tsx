import { WiseMark } from "@/components/wise-mark"
import { formatCheckoutUsd } from "@/lib/checkout-support"

export function CheckoutWiseInfo({ amountUsd }: { amountUsd: number }) {
  const charged = formatCheckoutUsd(amountUsd)

  return (
    <div className="mb-4 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4">
      <div className="flex items-center gap-2">
        <WiseMark />
        <p className="text-sm font-semibold text-[#0F172A]">Pay instantly with Wise</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[#334155]">
        Pay the USD total through Wise. Wise converts from your local currency if you hold one. No
        card fees, no SWIFT delays.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[#475569]">
        Don&apos;t have Wise yet? It is free and takes about 5 minutes to set up.
      </p>
      <p className="mt-3 text-sm font-semibold text-[#1D4ED8]">You will be charged {charged} USD.</p>
      <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
        Your order is recorded as {charged} USD. Tetrava does not add a conversion markup.
      </p>
    </div>
  )
}
