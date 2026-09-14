"use client"

import { useEffect, useState } from "react"
import styles from "./Filters.module.css"

import SortFilter from "./SortFilter/SortFilter"
import AuthorFilter from "./AuthorFilter/AuthorFilter"
import PriceFilter from "./PriceFilter/PriceFilter"

export default function Filters ({authors}: {authors: string[]}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="books-filters-panel"
      >
        <FilterIcon />
        Filters
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="books-filters-panel"
        className={open ? `${styles.filters} ${styles.open}` : styles.filters}
      >
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>Filters</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close filters"
          >
            <CloseIcon />
          </button>
        </div>

        <SortFilter />
        <AuthorFilter authors={authors} />
        <PriceFilter />
      </div>
    </>
  )
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M4.5 8H11.5M7 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}