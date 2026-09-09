"use client"

import styles from "./SortFilter.module.css"

import { useSearchParams, useRouter } from "next/navigation"
import * as Select from "@radix-ui/react-select"

const SORT_OPTIONS = [
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "price-asc", label: "Price \u2191" },
  { value: "price-desc", label: "Price \u2193" },
]

export default function SortFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const defaultSort = searchParams.get("sort") ?? ""

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    router.replace(`/books?${params.toString()}`)
  }

  return (
    <label className={styles.filtersSelect}>
      <span>Sort by:</span>
      <Select.Root name="sort" defaultValue={defaultSort} onValueChange={onSortChange}>
        <Select.Trigger className={styles.trigger} aria-label="Sort by">
          <Select.Value placeholder="Default" />
          <Select.Icon className={styles.icon}>
            <ChevronIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={styles.content}
            position="popper"
            sideOffset={4}
            side="bottom"
            avoidCollisions={false}
          >
            <Select.Viewport>
              {SORT_OPTIONS.map((option) => (
                <Select.Item key={option.value} value={option.value} className={styles.item}>
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles.indicator}>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </label>
  )
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}