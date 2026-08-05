"use client"

import { useSearchParams, useRouter } from "next/navigation"

import styles from "./AuthorFilter.module.css";

export default function AuthorFilter({ authors }: { authors: string[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedAuthors = searchParams.getAll("authors")

  const onAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams)

    const { checked, value } = e.target

    params.delete("authors");

    let updatedAuthors = [...selectedAuthors]

    if(checked) {
      updatedAuthors.push(value)
    } else {
      updatedAuthors = updatedAuthors.filter(
        author => author !== value
      )
    }

    updatedAuthors.forEach(author => {
      params.append("authors", author)
    })
    
    router.replace(`/books?${params.toString()}`)  
  }
  
  return (
    <fieldset className={styles.filterAuthors}>
      <legend>Author(s):</legend>

      {authors.map((author) => (
        <label key={author} className={styles.authorItem}>
          <input
            type="checkbox"
            name="authors"
            value={author}
            onChange={onAuthorChange}
          />
          <span>{author}</span>
        </label>
      ))}
    </fieldset>
  );
}