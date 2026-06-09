import { Suspense } from "react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <Suspense fallback={<p className="text-sm text-[#8A8AA0]">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </section>
  )
}
