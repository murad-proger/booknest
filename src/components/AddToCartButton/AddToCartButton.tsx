"use client"

import Button from "@/components/ui/Button/Button"
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
    <Button type="button" onClick={handleClick} disabled={isInCart}>
      {isInCart ? "Added" : "Add to cart"}
    </Button>
  )
}