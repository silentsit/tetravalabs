import { checkoutWhatsAppHref } from "@/lib/checkout-support"

export function CheckoutPaymentHelp() {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#F3E4C4] bg-[#FFF8EB] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <p className="text-sm font-medium text-[#0F172A]">Need help with payments? Message us.</p>
      <a
        href={checkoutWhatsAppHref()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#D97706] px-5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#B45309]"
      >
        WhatsApp
      </a>
    </div>
  )
}
