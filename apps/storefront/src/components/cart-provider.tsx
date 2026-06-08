"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type CartItem = {
  id: string
  productId: string
  handle: string
  title: string
  variantId: string
  variantTitle: string
  unitPrice: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clear: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "tetrava_cart_v1"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      setItems(JSON.parse(raw))
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => {
    const addItem: CartContextValue["addItem"] = (item, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((p) => p.id === item.id)
        if (existing) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
          )
        }
        return [...prev, { ...item, quantity }]
      })
    }

    const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id))

    const updateQty = (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
        return
      }
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)))
    }

    const clear = () => setItems([])
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

    return { items, addItem, removeItem, updateQty, clear, totalItems, subtotal }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider")
  }
  return ctx
}
