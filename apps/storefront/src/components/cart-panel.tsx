"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { getProductImage } from "@/lib/product-image-map"

export function CartPanel() {
  const { items, subtotal, totalItems, removeItem, updateQty } = useCart()

  return (
    <section className="card space-y-4 p-5">
      <h2 className="font-serif text-lg text-[#0F172A]">Cart ({totalItems})</h2>
      {items.length === 0 ? (
        <p className="text-sm text-[#475569]">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                <div className="flex gap-3">
                  <Image
                    src={getProductImage(item.handle)}
                    alt={item.title}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg bg-white object-contain"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${item.handle}`} className="text-sm font-medium text-[#0F172A]">
                          {item.title}
                        </Link>
                        <p className="text-xs text-[#94A3B8]">{item.variantTitle}</p>
                        <p className="text-xs text-[#475569]">${item.unitPrice.toFixed(2)} each</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0]"
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded border border-[#E2E8F0]"
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-[#E2E8F0] pt-3 text-sm text-[#475569]">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <div className="mt-3 flex gap-2">
              <Link href="/cart" className="btn-secondary px-3 py-2 text-xs">
                View cart
              </Link>
              <Link href="/checkout" className="btn-primary px-3 py-2 text-xs">
                Checkout
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
