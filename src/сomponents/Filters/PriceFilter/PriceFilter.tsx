"use client"

import styles from "./PriceFilter.module.css"

import { useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function PriceFilter () {
  const searchParams = useSearchParams()
  const router = useRouter()

  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const defaultPriceMin = searchParams.get("priceMin") ?? ""
  const defaultPriceMax = searchParams.get("priceMax") ?? "";

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(timeout.current) clearTimeout(timeout.current)
    
    const { name, value } = e.target
    
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
            defaultValue={defaultPriceMin}
            onChange={onPriceChange}
          />
        </div>
        <div>
          <input
            type="number"
            name="priceMax"
            placeholder="max"
            defaultValue={defaultPriceMax}
            onChange={onPriceChange}
          />
        </div>
      </div>
    </label>
  )
}