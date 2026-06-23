import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRight,
  Bitcoin,
  CheckCircle,
  Clock,
  CreditCard,
  Lock,
  ShieldCheck
} from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { ComplianceNotice } from "@/components/compliance-notice"
import { FaqAccordion } from "@/components/faq-accordion"
import { TrustBadgesRow } from "@/components/trust-badges"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "How to pay — card & crypto checkout",
  description:
    "Step-by-step payment guide for Tetrava Labs orders using credit card, Apple Pay, BTC, USDT, ETH, and other supported assets.",
  path: "/payment"
})

const steps = [
  {
    num: "01",
    icon: CreditCard,
    title: "Place Your Order",
    desc: "Add research compounds to your cart and proceed to checkout with your shipping details.",
    color: "#0D9488"
  },
  {
    num: "02",
    icon: CreditCard,
    title: "Select Payment Method",
    desc: "Pay by card (recommended) or choose cryptocurrency — BTC via BTCPay, other assets via Paymento.",
    color: "#2563EB"
  },
  {
    num: "03",
    icon: Bitcoin,
    title: "Complete Payment",
    desc: "Card payments use secure hosted checkout. Crypto orders show a wallet address or BTCPay invoice.",
    color: "#D97706"
  },
  {
    num: "04",
    icon: CheckCircle,
    title: "Order Confirmed",
    desc: "Once payment is confirmed, your order is marked paid and prepared for shipment.",
    color: "#059669"
  }
]

const cryptoOptions = [
  { name: "Bitcoin", ticker: "BTC", confirm: "~10 min", fee: "Low", icon: "B" },
  { name: "Ethereum", ticker: "ETH", confirm: "~2 min", fee: "Medium", icon: "E" },
  { name: "USDT", ticker: "USDT", confirm: "~2 min", fee: "Medium", icon: "T" }
]

const paymentFaqs = [
  {
    question: "Can I pay with a credit or debit card?",
    answer:
      "Yes. Card checkout (Visa, Mastercard, Amex, Apple Pay, Google Pay) is the default option at checkout via our secure payment partner."
  },
  {
    question: "Which cryptocurrencies are supported?",
    answer:
      "BTC is routed through BTCPay Server. USDT, ETH, and other supported assets are routed through Paymento based on your checkout selection."
  },
  {
    question: "How long does confirmation take?",
    answer:
      "Card payments usually confirm within a minute. BTC typically confirms within 10–60 minutes. USDT and ETH usually confirm within a few minutes."
  },
  {
    question: "Where do I get help if payment fails?",
    answer: "Contact support with your order ID. You can also revisit checkout to retry payment."
  }
]

export default function PaymentGuidePage() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-[#E2E8F0] bg-white py-12">
        <div className="page-container">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Payment Guide" }]} />
          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFBF1]">
              <ShieldCheck className="h-5 w-5 text-[#0D9488]" />
            </div>
            <span className="section-label">Secure Payments</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl text-[#0F172A] md:text-5xl">How to Pay</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
            Pay by credit or debit card at checkout, or choose cryptocurrency. BTC, USDT, ETH, and other
            supported assets are available depending on your selection.
          </p>
        </div>
      </section>

      <section className="page-container py-16">
        <h2 className="mb-10 text-center font-serif text-2xl text-[#0F172A]">The Payment Process</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-[#E2E8F0] bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon className="h-6 w-6" style={{ color: step.color }} />
              </div>
              <span className="font-mono text-xs text-[#94A3B8]">Step {step.num}</span>
              <h3 className="mt-1 font-serif text-lg text-[#0F172A]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-white py-16">
        <div className="page-container">
          <h2 className="mb-6 text-center font-serif text-2xl text-[#0F172A]">Default Payment Method</h2>
          <div className="mx-auto max-w-xl rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <div className="mb-4 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-[#0D9488]" />
              <h3 className="font-serif text-lg text-[#0F172A]">Credit &amp; debit cards</h3>
            </div>
            <p className="text-sm leading-relaxed text-[#475569]">
              The fastest option at checkout. You will be redirected to a secure hosted payment page to
              complete your purchase with Visa, Mastercard, Amex, Apple Pay, or Google Pay.
            </p>
          </div>

          <h2 className="mb-10 mt-12 text-center font-serif text-2xl text-[#0F172A]">Supported Assets</h2>
          <div className="mx-auto max-w-xl space-y-3">
            {cryptoOptions.map((opt) => (
              <div
                key={opt.ticker}
                className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] font-mono text-xs font-bold text-white">
                    {opt.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A]">{opt.name}</p>
                    <p className="text-xs text-[#94A3B8]">{opt.confirm} confirmation</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#CCFBF1] px-2.5 py-1 font-mono text-[10px] text-[#0D9488]">
                  {opt.fee} fee
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-16">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#CCFBF1]">
                <Lock className="h-5 w-5 text-[#0D9488]" />
              </div>
              <h2 className="font-serif text-2xl text-[#0F172A]">Your payment is protected</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                Payments are verified via signed webhooks from our payment partners before orders are marked
                paid.
              </p>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
              <h3 className="mb-4 font-serif text-lg text-[#0F172A]">Transaction timeline</h3>
              <div className="space-y-4">
                {[
                  { time: "0 min", label: "Payment sent", desc: "You send crypto from your wallet" },
                  { time: "1–10 min", label: "Confirmation", desc: "Network confirms the transaction" },
                  { time: "10 min", label: "Order confirmed", desc: "Order status updates to paid" },
                  { time: "24h", label: "Order ships", desc: "Fulfillment begins after payment" }
                ].map((step) => (
                  <div key={step.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white">
                      <Clock className="h-4 w-4 text-[#0D9488]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{step.label}</p>
                      <p className="text-xs text-[#94A3B8]">{step.desc}</p>
                      <p className="mt-0.5 font-mono text-[10px] text-[#0D9488]">{step.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] bg-white py-12">
        <div className="page-container">
          <TrustBadgesRow />
        </div>
      </section>

      <section className="page-container max-w-3xl py-16">
        <h2 className="mb-8 text-center font-serif text-2xl text-[#0F172A]">Payment questions</h2>
        <FaqAccordion items={paymentFaqs} />
      </section>

      <section className="border-t border-[#E2E8F0] bg-white py-16">
        <div className="page-container text-center">
          <h2 className="font-serif text-3xl text-[#0F172A]">Ready to order?</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/shop" className="btn-primary gap-2">
              Browse catalog <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact support
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container max-w-3xl pb-16 pt-8">
        <ComplianceNotice />
      </div>
    </div>
  )
}
