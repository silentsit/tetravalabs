import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Lock, Truck, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h1 className="font-serif text-3xl text-[#E8E8F0] md:text-4xl">Research Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-white/[0.04] p-6">
              <Truck className="h-10 w-10 text-[#5A5A70]" />
            </div>
            <p className="text-xl text-[#E8E8F0]">Your cart is empty</p>
            <p className="mt-2 text-sm text-[#8A8AA0]">Add research compounds to begin your order.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5EEAD4] px-6 py-3 text-sm font-medium text-[#050508] transition-all hover:brightness-110"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Items */}
            <div>
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-xl border border-white/[0.06] bg-[#0A0A10] p-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="text-base font-medium text-[#E8E8F0] hover:text-[#5EEAD4]"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-[#8A8AA0]">
                            {item.selectedVariant || item.product.strength} / {item.product.purity}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#5A5A70] transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] text-[#8A8AA0] hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm text-[#E8E8F0]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded border border-white/[0.06] text-[#8A8AA0] hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-medium text-[#E8E8F0]">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <Link
                  to="/shop"
                  className="flex items-center gap-1 text-sm text-[#8A8AA0] transition-colors hover:text-[#5EEAD4]"
                >
                  <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-[#5A5A70] transition-colors hover:text-[#8A8AA0]"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0A0A10] p-6 lg:sticky lg:top-24">
              <h2 className="mb-4 font-serif text-xl text-[#E8E8F0]">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8AA0]">Subtotal</span>
                  <span className="text-[#E8E8F0]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8A8AA0]">Shipping</span>
                  <span className="text-[#8A8AA0]">Calculated at checkout</span>
                </div>
              </div>

              <div className="my-4 border-t border-white/[0.06] pt-4">
                <div className="flex justify-between">
                  <span className="font-medium text-[#E8E8F0]">Total</span>
                  <span className="font-medium text-[#E8E8F0]">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mb-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5A5A70]" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="h-11 w-full rounded-lg border border-white/[0.06] bg-[#050508] pl-10 pr-4 text-sm text-[#E8E8F0] outline-none placeholder:text-[#5A5A70] focus:border-[#5EEAD4]"
                  />
                </div>
                <button className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-[#8A8AA0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]">
                  Apply
                </button>
              </div>

              <Link
                to="/checkout"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#5EEAD4] text-sm font-medium text-[#050508] transition-all hover:brightness-110"
              >
                <Lock className="h-4 w-4" /> Proceed to Checkout
              </Link>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#5A5A70]">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Secure SSL
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3" /> Cold-Chain
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
