import { LiveVisitorCounter, SocialProofReviews } from "@/components/social-proof-widget"

export function SocialProofSection() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Trusted by labs</p>
          <h2 className="mt-2 font-serif text-3xl text-[#E8E8F0]">Research Community</h2>
          <p className="mt-2 max-w-xl text-[#8A8AA0]">
            Illustrative feedback from research professionals. Not medical endorsements.
          </p>
        </div>
        <LiveVisitorCounter />
      </div>
      <SocialProofReviews />
    </section>
  )
}
