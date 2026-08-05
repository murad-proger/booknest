"use client"

import styles from "./SortFilter.module.css"

import { useSearchParams, useRouter } from "next/navigation"

export default function SortFilter () {
  const searchParams = useSearchParams()
  const route = useRouter()

  const defaultSort = searchParams.get('sort') ?? ''

  const onSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams)
    
    const { value } = e.target

    if(value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    
    route.replace(`/books?${params.toString()}`)
  }

  return (
    <label className={styles.filtersSelect}>
      <span>Sort by:</span>
      <select
        name="sort"
        defaultValue={defaultSort}
        onChange={onSortChange}
      >
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="price-asc">Price &#8593;</option>
        <option value="price-desc">Price &#x2193;</option>
      </select>
    </label>
  )
}