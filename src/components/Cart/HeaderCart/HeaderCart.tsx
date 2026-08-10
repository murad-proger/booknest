"use client"

import styles from "./HeaderCart.module.css"

import Link from "next/link"

import { useAppSelector } from "@/lib/hooks"


export default function HeaderCart() {
  const items = useAppSelector((state) => state.cart.items)

  const totalQuantity = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  return (
    <Link
      href="/cart"
      className={styles.cart}
      aria-label={`Cart, ${totalQuantity} items`}
    >
      <span className={styles.icon}>🛒</span>

      {totalQuantity > 0 && (
        <span className={styles.badge}>
          {totalQuantity}
        </span>
      )}
    </Link>
  )
}