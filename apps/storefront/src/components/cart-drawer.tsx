"use client"

import Link from "next/link"
import { Lock, Minus, Plus, Trash2, Truck, X } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { getProductImage } from "@/lib/product-image-map"

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, subtotal } = useCart()
  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed bottom-0 right-0 top-0 z-[80] flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          <h2 className="font-serif text-xl text-[#0F172A]">Your Cart</h2>
          <button type="button" onClick={() => setIsOpen(false)} className="text-[#94A3B8] hover:text-[#0F172A]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Truck className="h-10 w-10 text-[#CBD5E1]" />
              <p className="mt-4 text-[#0F172A]">Your cart is empty</p>
              <p className="mt-1 text-sm text-[#94A3B8]">Add research compounds to begin.</p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-4 text-sm text-[#0D9488] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white">
                    <img
                      src={getProductImage(item.handle)}
                      alt={item.title}
                      className="h-14 w-14 rounded-lg object-contain"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{item.title}</p>
                        <p className="text-xs text-[#94A3B8]">{item.variantTitle}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#CBD5E1] hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0] text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm text-[#0F172A]">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0] text-[#475569] hover:border-[#0D9488] hover:text-[#0D9488]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-[#0F172A]">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 ? (
          <div className="border-t border-[#E2E8F0] px-6 py-4">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#475569]">Subtotal</span>
                <span className="text-[#0F172A]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#475569]">Shipping</span>
                <span className="text-[#94A3B8]">Calculated at checkout</span>
              </div>
              <div className="flex justify-between border-t border-[#E2E8F0] pt-2">
                <span className="font-medium text-[#0F172A]">Total</span>
                <span className="font-medium text-[#0F172A]">${subtotal.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="btn-primary w-full gap-2">
              <Lock className="h-4 w-4" /> Proceed to Checkout
            </Link>
          </div>
        ) : null}
      </div>
    </>
  )
}
