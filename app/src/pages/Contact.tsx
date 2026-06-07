import { useState } from 'react';
import { Mail, MessageCircle, Clock, Send } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5EEAD4]">Contact</span>
        <h1 className="mt-4 font-serif text-4xl text-[#E8E8F0] md:text-5xl">Contact Us</h1>
        <p className="mt-4 text-[#8A8AA0]">
          Our research support team is here to assist with inquiries about products, orders, and analytical data.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="h-12 rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                required
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="h-12 rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
              required
            />
            <textarea
              placeholder="How can we help?"
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={6}
              className="w-full resize-none rounded-lg border border-white/[0.06] bg-[#0A0A10] px-4 py-3 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
              required
            />
            <button
              type="submit"
              className="flex h-12 items-center gap-2 rounded-lg bg-[#5EEAD4] px-8 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
            >
              <Send className="h-4 w-4" />
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>

          {/* Info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <Mail className="mb-3 h-6 w-6 text-[#5EEAD4]" />
              <h3 className="font-medium text-[#E8E8F0]">Email</h3>
              <p className="mt-1 text-sm text-[#8A8AA0]">support@tetravalabs.com</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <MessageCircle className="mb-3 h-6 w-6 text-[#5EEAD4]" />
              <h3 className="font-medium text-[#E8E8F0]">Live Chat</h3>
              <p className="mt-1 text-sm text-[#8A8AA0]">Available during business hours</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <Clock className="mb-3 h-6 w-6 text-[#5EEAD4]" />
              <h3 className="font-medium text-[#E8E8F0]">Business Hours</h3>
              <p className="mt-1 text-sm text-[#8A8AA0]">Mon-Fri: 9AM - 6PM EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
