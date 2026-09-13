"use client"

import styles from "./PriceFilter.module.css"

import { useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PriceFilter () {
  const searchParams = useSearchParams()
  const router = useRouter()

  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [syncedUrl, setSyncedUrl] = useState(searchParams.toString())
  const [priceMin, setPriceMin] = useState(() => searchParams.get("priceMin") ?? "")
  const [priceMax, setPriceMax] = useState(() => searchParams.get("priceMax") ?? "")

  if (searchParams.toString() !== syncedUrl) {
    setSyncedUrl(searchParams.toString())
    setPriceMin(searchParams.get("priceMin") ?? "")
    setPriceMax(searchParams.get("priceMax") ?? "")
  }

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(timeout.current) clearTimeout(timeout.current)

    const { name, value } = e.target

    if (name === "priceMin") {
      setPriceMin(value)
    } else {
      setPriceMax(value)
    }

    timeout.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if(Number(value) > 0) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      router.replace(`/books?${params.toString()}`)
      }, 400);
  }

  return (
    <label className={styles.filterPrice}>
      <span>Price:</span>
      <div className={styles.filterRow}>
        <div>
          <input
            type="number"
            name="priceMin"
            placeholder="min"
            value={priceMin}
            onChange={onPriceChange}
          />
        </div>
        <div>
          <input
            type="number"
            name="priceMax"
            placeholder="max"
            value={priceMax}
            onChange={onPriceChange}
          />
        </div>
      </div>
    </label>
  )
}
