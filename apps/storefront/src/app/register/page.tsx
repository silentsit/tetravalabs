export default function RegisterPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Register</h1>
      <form className="max-w-md space-y-3 rounded-lg border border-white/10 bg-[#0A0A10] p-5">
        <div>
          <label className="block text-xs text-[#8A8AA0]">Email</label>
          <input type="email" className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs text-[#8A8AA0]">Password</label>
          <input type="password" className="mt-1 w-full rounded border border-white/20 bg-[#050508] px-3 py-2" />
        </div>
        <label className="flex items-start gap-2 text-xs text-[#8A8AA0]">
          <input type="checkbox" className="mt-1" /> I acknowledge research-use-only terms.
        </label>
        <button className="rounded bg-[#5EEAD4] px-4 py-2 text-sm font-medium text-[#050508]">
          Create Account
        </button>
      </form>
    </section>
  )
}
