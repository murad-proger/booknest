"use client"

import styles from "./Counter.module.css"

import { useAppDispatch } from "@/lib/hooks"
import { changeQuantity } from "@/lib/features/cart/cartSlice"

type CounterProps = {
  id: number
  quantity: number
}

export default function Counter({ id, quantity }: CounterProps) {
  const dispatch = useAppDispatch()

  const handleChange = (newQuantity: number) => {
    if (newQuantity < 1) return

    dispatch(
      changeQuantity({
        id,
        quantity: newQuantity,
      })
    )
  }

  return (
    <div className={styles.counter}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => handleChange(quantity - 1)}
      >
        -
      </button>

      <input
        type="number"
        min={1}
        aria-label="Quantity"
        value={quantity}
        onChange={(event) => handleChange(Number(event.target.value))}
      />

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => handleChange(quantity + 1)}
      >
        +
      </button>
    </div>
  )
}