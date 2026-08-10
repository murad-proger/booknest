"use client"

import styles from "./AddToCartButton.module.css"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addToCart } from "@/lib/features/cart/cartSlice"

export default function AddToCartButton({ id }: { id: number }) {
  const dispatch = useAppDispatch()

  const isInCart = useAppSelector((state) =>
    state.cart.items.some((item) => item.id === id)
  )

  const handleClick = () => {
    dispatch(addToCart(id))
  }

  return (
    <button
      className={styles.button}
      onClick={handleClick}
      type="button"
      disabled={isInCart}
    >
      {isInCart ? "Added" : "Add to cart"}
    </button>
  )
}