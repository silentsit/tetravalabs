import Link from "next/link"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <section className="page-container space-y-6 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Register" }]} />
      <div>
        <span className="section-label">Account</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Create account</h1>
        <p className="mt-3 text-sm text-[#475569]">
          Already registered?{" "}
          <Link href="/login" className="text-[#0D9488] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      <RegisterForm />
    </section>
  )
}
