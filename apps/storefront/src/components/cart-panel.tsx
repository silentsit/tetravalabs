"use client"

import Link from "next/link"
import { useCart } from "@/components/cart-provider"

export function CartPanel() {
  const { items, subtotal, totalItems, removeItem, updateQty } = useCart()

  return (
    <section className="space-y-4 rounded-lg border border-white/10 bg-[#0A0A10] p-4">
      <h2 className="text-lg font-medium">Cart ({totalItems})</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#8A8AA0]">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-md border border-white/10 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/product/${item.handle}`} className="text-sm text-[#E8E8F0]">
                      {item.title}
                    </Link>
                    <p className="text-xs text-[#8A8AA0]">{item.variantTitle}</p>
                    <p className="text-xs text-[#8A8AA0]">${item.unitPrice.toFixed(2)} each</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-[#FCA5A5] hover:text-[#F87171]"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    className="rounded border border-white/20 px-2"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    className="rounded border border-white/20 px-2"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 pt-3 text-sm text-[#8A8AA0]">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <div className="mt-3 flex gap-2">
              <Link href="/cart" className="rounded border border-white/20 px-3 py-2 text-xs">
                View Cart
              </Link>
              <Link
                href="/checkout"
                className="rounded bg-[#5EEAD4] px-3 py-2 text-xs text-[#050508]"
              >
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
