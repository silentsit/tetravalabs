"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import type { FulfillmentMode, LabRestockCadenceDays } from "@/lib/lab-restock"

export type CartItem = {
  id: string
  productId: string
  handle: string
  title: string
  variantId: string
  variantTitle: string
  /** Price charged per unit (restock-discounted when applicable). */
  unitPrice: number
  quantity: number
  fulfillment?: FulfillmentMode
  restockCadenceDays?: LabRestockCadenceDays
  /** One-time pack price before Lab Restock discount (for display). */
  oneTimeUnitPrice?: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clear: () => void
  totalItems: number
  subtotal: number
  hasLabRestock: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = "tetrava_cart_v1"

function normalizeItem(raw: Partial<CartItem>): CartItem | null {
  if (!raw.id || !raw.productId || !raw.variantId || !raw.handle || !raw.title) return null
  if (typeof raw.unitPrice !== "number" || typeof raw.quantity !== "number") return null
  const fulfillment: FulfillmentMode =
    raw.fulfillment === "lab_restock" ? "lab_restock" : "one_time"
  return {
    id: raw.id,
    productId: raw.productId,
    handle: raw.handle,
    title: raw.title,
    variantId: raw.variantId,
    variantTitle: raw.variantTitle || "",
    unitPrice: raw.unitPrice,
    quantity: raw.quantity,
    fulfillment,
    restockCadenceDays:
      fulfillment === "lab_restock" &&
      (raw.restockCadenceDays === 30 ||
        raw.restockCadenceDays === 60 ||
        raw.restockCadenceDays === 90)
        ? raw.restockCadenceDays
        : undefined,
    oneTimeUnitPrice:
      typeof raw.oneTimeUnitPrice === "number" ? raw.oneTimeUnitPrice : undefined
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) {
        setItems([])
        return
      }
      setItems(parsed.map(normalizeItem).filter((item): item is CartItem => item != null))
    } catch {
      setItems([])
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Stable callbacks — avoid re-running consumers (reorder seed / chat) on every cart change.
  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id)
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      }
      return [
        ...prev,
        {
          ...item,
          fulfillment: item.fulfillment || "one_time",
          quantity
        }
      ]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateQty = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((p) => p.id !== id))
      return
    }
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
    const hasLabRestock = items.some((item) => item.fulfillment === "lab_restock")

    return {
      items,
      addItem,
      removeItem,
      updateQty,
      clear,
      totalItems,
      subtotal,
      hasLabRestock,
      isOpen,
      setIsOpen
    }
  }, [items, isOpen, addItem, removeItem, updateQty, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider")
  }
  return ctx
}
