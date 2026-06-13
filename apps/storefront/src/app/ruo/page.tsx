import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { LegalPageShell } from "@/components/legal-page-shell"
import { buildPageMetadata } from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: "Research Use Only Policy",
  path: "/ruo"
})

export default async function RuoGatePage() {
  async function acknowledge() {
    "use server"
    const jar = await cookies()
    jar.set("tetrava_ruo_ack", "v1", {
      sameSite: "lax",
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    })
    redirect("/")
  }

  return (
    <LegalPageShell eyebrow="Compliance" title="Research Use Only Policy">
      <div className="space-y-6 text-sm leading-relaxed text-[#8A8AA0]">
        <p>
          Tetrava Labs supplies peptides and research compounds exclusively for in-vitro laboratory
          research by qualified professionals. Products are not approved for human or veterinary
          consumption, clinical use, or any application involving living subjects.
        </p>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Purchaser obligations</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>You are 18 years of age or older and purchasing on behalf of a legitimate research entity.</li>
            <li>You will use products only in controlled laboratory settings with appropriate safety protocols.</li>
            <li>You will not resell, relabel, or represent products as suitable for human or animal use.</li>
            <li>You accept full responsibility for handling, storage, and disposal per institutional guidelines.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#E8E8F0]">Product disclaimers</h2>
          <p>
            Certificates of Analysis (COA) and purity data reflect batch-specific testing at time of
            manufacture. Specifications may change between lots. No product statement constitutes
            medical advice, a therapeutic claim, or an endorsement of off-label use.
          </p>
        </section>

        <div className="rounded-xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-5 text-[#FBBF24]">
          By continuing, you acknowledge that you understand these restrictions and agree to comply
          with all applicable laws in your jurisdiction.
        </div>
      </div>

      <form action={acknowledge}>
        <button className="rounded-lg bg-[#5EEAD4] px-6 py-2.5 text-sm font-medium text-[#050508] transition hover:brightness-110">
          I Understand And Agree
        </button>
      </form>
    </LegalPageShell>
  )
}
