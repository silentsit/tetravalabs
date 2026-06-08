export default function LoginPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Sign In</h1>
      <form className="max-w-md space-y-3 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <div>
          <label className="block text-xs text-[#8A8AA0]">Email</label>
          <input type="email" className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs text-[#8A8AA0]">Password</label>
          <input type="password" className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2" />
        </div>
        <button className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508]">
          Sign In
        </button>
        <p className="text-xs text-[#8A8AA0]">
          Auth API wiring is next phase; this form is now production-layout ready.
        </p>
      </form>
    </section>
  )
}
