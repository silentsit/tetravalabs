import { HeroSection } from "@/components/home/hero-section"
import { FeaturedCategories } from "@/components/home/featured-categories"
import { FeaturedProducts } from "@/components/home/featured-products"
import { TrustStrip } from "@/components/home/trust-strip"
import { PaymentSection } from "@/components/home/payment-section"
import { SocialProofSection } from "@/components/home/social-proof-section"
import { FaqPreview } from "@/components/home/faq-preview"

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <TrustStrip />
      <SocialProofSection />
      <PaymentSection />
      <FaqPreview />
      <section className="rounded-xl border border-[#FBBF24]/20 bg-[#0A0A10] p-6 text-sm text-[#8A8AA0]">
        <p className="text-[#FBBF24]">Research Use Only</p>
        <p className="mt-2">
          All compounds are sold strictly for in-vitro laboratory research by qualified
          professionals. Not for human or veterinary use.
        </p>
      </section>
    </div>
  )
}
