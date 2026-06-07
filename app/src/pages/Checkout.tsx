import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Copy, CheckCircle, MessageCircle, CreditCard, Bitcoin } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const walletAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0';

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [paymentTab, setPaymentTab] = useState<'crypto' | 'card'>('crypto');
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    email: '', firstName: '', lastName: '', address: '', city: '', country: 'US', postalCode: '',
  });

  const copyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-20">
        <p className="text-xl text-[#E8E8F0]">Your cart is empty</p>
        <Link to="/shop" className="mt-4 text-[#5EEAD4]">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="mb-8 flex items-center gap-3">
          <Lock className="h-6 w-6 text-[#5EEAD4]" />
          <h1 className="font-serif text-3xl text-[#E8E8F0] md:text-4xl">Secure Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Form */}
          <div className="space-y-8">
            {/* Contact */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <h2 className="mb-4 font-medium text-[#E8E8F0]">Contact Information</h2>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="h-12 w-full rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
              />
            </div>

            {/* Shipping */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <h2 className="mb-4 font-medium text-[#E8E8F0]">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  className="h-12 rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  className="h-12 rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="sm:col-span-2 h-12 rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="h-12 rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={e => setForm({ ...form, postalCode: e.target.value })}
                  className="h-12 rounded-lg border border-white/[0.06] bg-[#050508] px-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                />
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6">
              <h2 className="mb-4 font-medium text-[#E8E8F0]">Payment Method</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentTab('crypto')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm transition-all ${
                    paymentTab === 'crypto'
                      ? 'border-[#5EEAD4] bg-[#5EEAD4]/10 text-[#5EEAD4]'
                      : 'border-white/[0.06] text-[#8A8AA0] hover:text-[#E8E8F0]'
                  }`}
                >
                  <Bitcoin className="h-4 w-4" /> Cryptocurrency
                </button>
                <button
                  onClick={() => setPaymentTab('card')}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm transition-all ${
                    paymentTab === 'card'
                      ? 'border-[#A78BFA] bg-[#A78BFA]/10 text-[#A78BFA]'
                      : 'border-white/[0.06] text-[#8A8AA0] hover:text-[#E8E8F0]'
                  }`}
                >
                  <CreditCard className="h-4 w-4" /> Card → Crypto
                </button>
              </div>

              {paymentTab === 'crypto' && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-[#8A8AA0]">
                    Send the exact amount to the wallet address below. Select your preferred network at checkout.
                  </p>
                  <div className="rounded-lg border border-white/[0.06] bg-[#050508] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-[#5A5A70]">Wallet Address (Ethereum ERC-20)</span>
                      <button
                        onClick={copyWallet}
                        className="flex items-center gap-1 text-xs text-[#5EEAD4] transition-colors hover:brightness-110"
                      >
                        {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <code className="block break-all font-mono text-sm text-[#E8E8F0]">
                      {walletAddress}
                    </code>
                  </div>
                  <div className="rounded-lg border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-4">
                    <p className="text-xs text-[#FBBF24]/80">
                      Ensure you send on the correct network. Transactions on wrong networks cannot be recovered.
                      Your order will be processed after network confirmation (typically 10-30 minutes).
                    </p>
                  </div>
                </div>
              )}

              {paymentTab === 'card' && (
                <div className="mt-6 space-y-4">
                  <p className="text-sm text-[#8A8AA0]">
                    You will be redirected to our crypto on-ramp partner to purchase cryptocurrency
                    with your credit/debit card. No prior crypto experience or wallet required.
                  </p>
                  <div className="rounded-lg border border-[#A78BFA]/20 bg-[#A78BFA]/5 p-4">
                    <p className="text-xs text-[#A78BFA]/80">
                      The process takes approximately 3 minutes. When prompted for a destination address,
                      paste our wallet address exactly as shown. No KYC required for purchases under $500.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-4">
              <MessageCircle className="h-5 w-5 text-[#5EEAD4]" />
              <p className="text-sm text-[#8A8AA0]">
                Need help?{' '}
                <Link to="/contact" className="text-[#5EEAD4] hover:underline">
                  Contact our research support team
                </Link>
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-4 font-serif text-xl text-[#E8E8F0]">Order Summary</h2>
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm text-[#E8E8F0]">{item.product.name}</p>
                    <p className="text-xs text-[#8A8AA0]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-[#E8E8F0]">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-white/[0.06] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8AA0]">Subtotal</span>
                <span className="text-[#E8E8F0]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8AA0]">Shipping</span>
                <span className="text-[#8A8AA0]">Calculated</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-2">
                <span className="font-medium text-[#E8E8F0]">Total</span>
                <span className="font-medium text-[#E8E8F0]">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#5EEAD4] text-sm font-medium text-[#050508] transition-all hover:brightness-110">
              <Lock className="h-4 w-4" /> Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
