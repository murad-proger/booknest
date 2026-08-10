"use client"

import { useAppDispatch } from "@/lib/hooks"
import { addToCart } from "@/lib/features/cart/cartSlice"

export default function AddToCartButton({ id }: { id: number }) {
  const dispatch = useAppDispatch()

  const handleClick = (id: number) => {
    dispatch(addToCart(id))
  }

  return (
    <button
      onClick={() => handleClick(id)}
      type="button"
    >
      Add to cart
    </button>
  )
}