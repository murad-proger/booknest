"use client"

import { useEffect, useState } from "react"
import { Provider } from "react-redux"

import { makeStore } from "@/lib/store"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { hydrateCart, setHydrated } from "@/lib/features/cart/cartSlice"
import CartSync from "@/components/Cart/CartSync/CartSync"


function CartPersistence() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)
  const [persistenceHydrated, setPersistenceHydrated] = useState(false)

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
      dispatch(setHydrated())
      setPersistenceHydrated(true)
    }
  }, [dispatch])

  useEffect(() => {
    if (!persistenceHydrated) return

    localStorage.setItem("cart", JSON.stringify(items))
  }, [items, persistenceHydrated])

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
      <CartSync />
      {children}
    </Provider>
  )
}