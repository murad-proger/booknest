"use client"

import { useEffect, useState } from "react"
import { Provider } from "react-redux"

import { makeStore } from "@/lib/store"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { hydrateCart } from "@/lib/features/cart/cartSlice"


function CartPersistence() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart")

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)

        if (Array.isArray(parsedCart)) {
          dispatch(hydrateCart(parsedCart))
        }
      }
    } catch {
      localStorage.removeItem("cart")
    } finally {
      setHydrated(true)
    }
  }, [dispatch])

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem("cart", JSON.stringify(items))
  }, [items, hydrated])

  return null
}


export default function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [store] = useState(makeStore)

  return (
    <Provider store={store}>
      <CartPersistence />
      {children}
    </Provider>
  )
}