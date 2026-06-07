import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2, Lock, Truck, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col bg-[#0A0A10] shadow-2xl md:bottom-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-serif text-xl text-[#E8E8F0]">Research Cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#8A8AA0] transition-colors hover:text-[#E8E8F0]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-white/[0.04] p-4">
                <Truck className="h-8 w-8 text-[#5A5A70]" />
              </div>
              <p className="text-[#E8E8F0]">Your cart is empty</p>
              <p className="mt-1 text-sm text-[#8A8AA0]">
                Add research compounds to begin.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 text-sm text-[#5EEAD4] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-lg border border-white/[0.06] bg-[#050508] p-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#E8E8F0]">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#8A8AA0]">
                          {item.selectedVariant || item.product.strength}
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
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-white/[0.06] text-[#8A8AA0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm text-[#E8E8F0]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded border border-white/[0.06] text-[#8A8AA0] transition-colors hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-[#E8E8F0]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-white/[0.06] px-6 py-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8AA0]">Subtotal</span>
                <span className="text-[#E8E8F0]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8AA0]">Shipping</span>
                <span className="text-[#8A8AA0]">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-2">
                <span className="font-medium text-[#E8E8F0]">Total</span>
                <span className="font-medium text-[#E8E8F0]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#5EEAD4] text-sm font-medium text-[#050508] transition-all hover:brightness-110"
            >
              <Lock className="h-4 w-4" />
              Proceed to Checkout
              <ChevronRight className="h-4 w-4" />
            </Link>

            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[#5A5A70]">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Secure SSL
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3" /> Cold-Chain
              </span>
            </div>

            <button
              onClick={clearCart}
              className="mt-3 w-full text-center text-xs text-[#5A5A70] hover:text-[#8A8AA0]"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
