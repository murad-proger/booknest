"use client"

import { useSearchParams, useRouter } from "next/navigation"
import * as Checkbox from "@radix-ui/react-checkbox"

import styles from "./AuthorFilter.module.css"

export default function AuthorFilter({ authors }: { authors: string[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedAuthors = searchParams.getAll("authors")

  const onAuthorChange = (author: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams)

    params.delete("authors")

    let updatedAuthors = [...selectedAuthors]

    if (checked) {
      updatedAuthors.push(author)
    } else {
      updatedAuthors = updatedAuthors.filter((a) => a !== author)
    }

    updatedAuthors.forEach((a) => {
      params.append("authors", a)
    })

    router.replace(`/books?${params.toString()}`)
  }

  return (
    <fieldset className={styles.filterAuthors}>
      <legend>Author(s):</legend>

      {authors.map((author) => (
        <label key={author} className={styles.authorItem}>
          <Checkbox.Root
            className={styles.checkbox}
            name="authors"
            value={author}
            defaultChecked={selectedAuthors.includes(author)}
            onCheckedChange={(checked) => onAuthorChange(author, checked === true)}
          >
            <Checkbox.Indicator className={styles.indicator}>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span>{author}</span>
        </label>
      ))}
    </fieldset>
  )
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}