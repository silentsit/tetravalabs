import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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
    <section className="mx-auto max-w-2xl space-y-4 rounded-lg border border-white/10 bg-[#0A0A10] p-6">
      <h1 className="text-2xl font-semibold">Research Use Only Acknowledgment</h1>
      <p className="text-[#8A8AA0]">
        By continuing, you acknowledge that all compounds are intended strictly for laboratory
        research and not for human consumption.
      </p>
      <form action={acknowledge}>
        <button className="rounded-md bg-[#5EEAD4] px-4 py-2 text-[#050508]">
          I Understand And Agree
        </button>
      </form>
    </section>
  )
}
