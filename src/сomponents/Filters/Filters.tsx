import styles from "./Filters.module.css"

import SortFilter from "./SortFilter/SortFilter"
import AuthorFilter from "./AuthorFilter/AuthorFilter"
import PriceFilter from "./PriceFilter/PriceFilter"

export default function Filters ({authors}: {authors: string[]}) {
  return (
    <div className={styles.filters}>
      <SortFilter />
      <AuthorFilter authors={authors} />
      <PriceFilter />
    </div>
  )
}