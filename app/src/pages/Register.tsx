import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-16">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-[#5EEAD4]" />
              <span className="font-mono text-sm tracking-[0.15em] text-[#E8E8F0]">TETRAVA</span>
            </Link>
            <h1 className="mt-4 font-serif text-2xl text-[#E8E8F0]">Create Research Account</h1>
          </div>

          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
            />
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#050508] px-4 pr-12 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A70] hover:text-[#8A8AA0]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <input
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
            />

            <label className="flex items-start gap-2 text-xs text-[#8A8AA0]">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={e => setForm({ ...form, agree: e.target.checked })}
                className="mt-0.5 rounded border-white/[0.06] bg-[#050508]"
              />
              I confirm I am a qualified research professional and agree to the{' '}
              <Link to="/terms" className="text-[#5EEAD4] hover:underline">Terms</Link> and{' '}
              <Link to="/privacy" className="text-[#5EEAD4] hover:underline">Privacy Policy</Link>.
            </label>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#5EEAD4] text-sm font-medium text-[#050508] transition-all hover:brightness-110"
            >
              Create Account
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-[#5A5A70]">or</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-white/[0.06] text-sm text-[#E8E8F0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
          >
            Already have an account? Sign In
          </Link>

          <div className="mt-6 flex items-start gap-2 rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#FBBF24]" />
            <p className="text-xs text-[#FBBF24]/80">
              By creating an account, you confirm you are a qualified research professional purchasing
              compounds for legitimate laboratory research purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
