import Link from "next/link"
import { Suspense } from "react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <section className="page-container space-y-6 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign in" }]} />
      <div>
        <span className="section-label">Account</span>
        <h1 className="mt-2 font-serif text-4xl text-[#0F172A]">Sign in</h1>
        <p className="mt-3 text-sm text-[#475569]">
          No account?{" "}
          <Link href="/account" className="text-[#0D9488] hover:underline">
            Create one
          </Link>
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-[#475569]">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </section>
  )
}
