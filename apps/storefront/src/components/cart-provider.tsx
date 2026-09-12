"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Context
} from "react"

export type CartItem = {
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
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const STORAGE_KEY = "tetrava_cart_v1"

/**
 * Keep one Context object across Fast Refresh. A second module copy of this
 * file makes useCart read a different context than CartProvider writes.
 */
const cartContextKey = "__tetravaCartContext"
const CartContext = (() => {
  const g = globalThis as typeof globalThis & {
    [cartContextKey]?: Context<CartContextValue | null>
  }
  if (!g[cartContextKey]) {
    g[cartContextKey] = createContext<CartContextValue | null>(null)
  }
  return g[cartContextKey]
})()

function normalizeItem(raw: Partial<CartItem>): CartItem | null {
  if (!raw.id || !raw.productId || !raw.variantId || !raw.handle || !raw.title) return null
  if (typeof raw.unitPrice !== "number" || typeof raw.quantity !== "number") return null
  return {
    id: raw.id,
    productId: raw.productId,
    handle: raw.handle,
    title: raw.title,
    variantId: raw.variantId,
    variantTitle: raw.variantTitle || "",
    unitPrice: raw.unitPrice,
    quantity: raw.quantity
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setHydrated(true)
      return
    }
    try {
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        setItems([])
      } else {
        setItems(parsed.map(normalizeItem).filter((item): item is CartItem => item != null))
      }
    } catch {
      setItems([])
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [hydrated, items])

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      }
      return [...prev, { ...item, quantity }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateQty = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p))
        .filter((p) => p.quantity > 0)
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalItems,
      subtotal,
      isOpen,
      setIsOpen
    }
  }, [items, addItem, removeItem, updateQty, clear, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
