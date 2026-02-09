"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { getOfferingByName } from "../../lib/offerings"

const CART_KEY = "shipgate_cart"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(CART_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) setCart(parsed)
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = useCallback((nextCart) => {
    setCart(nextCart)
    try {
      if (typeof window !== "undefined") localStorage.setItem(CART_KEY, JSON.stringify(nextCart))
    } catch {
      // ignore
    }
  }, [])

  const addItem = useCallback(
    (serviceName) => {
      const offering = getOfferingByName(serviceName)
      if (!offering) return
      const nextCart = [...cart, { id: offering.id, name: offering.name, price: offering.price }]
      persist(nextCart)
      setShowAddModal(true)
    },
    [cart, persist]
  )

  const removeItem = useCallback(
    (id) => {
      const idx = cart.findIndex((i) => i.id === id)
      if (idx === -1) return
      const nextCart = cart.slice(0, idx).concat(cart.slice(idx + 1))
      persist(nextCart)
    },
    [cart, persist]
  )

  const removeItemAt = useCallback(
    (index) => {
      if (index < 0 || index >= cart.length) return
      const nextCart = cart.slice(0, index).concat(cart.slice(index + 1))
      persist(nextCart)
    },
    [cart, persist]
  )

  const clearCart = useCallback(() => {
    persist([])
  }, [persist])

  const closeAddModal = useCallback(() => {
    setShowAddModal(false)
  }, [])

  const value = {
    cart,
    addItem,
    removeItem,
    removeItemAt,
    clearCart,
    showAddModal,
    closeAddModal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
