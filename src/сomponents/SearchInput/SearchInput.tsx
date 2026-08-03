"use client"

import styles from "./SearchInput.module.css"

import { useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SearchInput() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  
  const updateSearchParams = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if(value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    router.replace(`/books?${params.toString()}`)
  }
  
  const handleSearch = (value: string) => {
    const validatedValue = value.trim()

    if(timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      updateSearchParams(validatedValue)
    }, 400);
  }
  return (
    <input
      className={styles.searchInput}
      type="text"
      placeholder="Search books..."
      defaultValue={searchParams.get("search") ?? ""}
      onChange={e => handleSearch(e.target.value)}
    />
  )
}