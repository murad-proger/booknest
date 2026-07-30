"use client"

import styles from "./updateBookForm.module.css"

import { useActionState } from "react"
import  { type CreateBookActionResult, updateBookAction } from "@/actions/books"

type Props = {
  book: {
    title: string;
    author: string;
    price: number;
    img: string;
    id: number;
  }
}

const initialState: CreateBookActionResult = {
  success: false,
  errors: {}
}

export default function UpdateBookForm ({book}: Props) {
  const {title, author, price, img, id} = book
  
  const [state, formAction] = useActionState(updateBookAction, initialState)

  return (
    <form
      action={formAction}
      className={styles.updateBook}
    >
      {
        state.errors?.form && (
          <p>{state.errors.form}</p>
        )
      }
      <label>
        <span>title:</span>
        <input type="text" name="title" defaultValue={title} />
        {
          state.errors?.title && (
            <p>{state.errors.title}</p>
          )
        }
      </label>
      <label>
        <span>author:</span>
        <input type="text" name="author" defaultValue={author} />
        {
          state.errors?.author && (
            <p>{state.errors.author}</p>
          )
        }
      </label>
      <label>
        <span>price:</span>
        <input type="text" name="price" defaultValue={price} placeholder="minimum 1$"/>
        {
          state.errors?.price && (
            <p>{state.errors.price}</p>
          )
        }
      </label>
      <label>
        <span>img:</span>
        <input type="text" name="img" defaultValue={img} />
      </label>
      <input type="hidden" name="id" defaultValue={id} />
      <button type="submit">
        Update
      </button>
    </form>
  )
}