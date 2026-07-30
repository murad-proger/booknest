"use client"
import styles from "./CreateBookForm.module.css"

import { useActionState } from "react"
import { createBookAction, type CreateBookActionResult } from "@/actions/books"

const initialState: CreateBookActionResult = {
  success: false,
  errors: {}
}

export default function CreateBookForm () {

  const [state, formAction] = useActionState(createBookAction, initialState)

  return (
    <form
      action={formAction}
      className={styles.createBook}
    >
      {
        state.errors?.form && (
          <p><b>{state.errors.form}</b></p>
        )
      }
      <label>
        <span>title:</span>
        <input type="text" name="title"/>
        {
          state.errors?.title && (
            <p>{state.errors.title}</p>
          )
        }
      </label>
      <label>
        <span>author:</span>
        <input type="text" name="author"/>
        {
          state.errors?.author && (
            <p>{state.errors.author}</p>
          )
        }
      </label>
      <label>
        <span>price:</span>
        <input type="text" name="price" placeholder="minimum 1$"/>
        {
          state.errors?.price && (
            <p>{state.errors.price}</p>
          )
        }
      </label>
      <label>
        <span>img:</span>
        <input type="text" name="img"/>
        {
          state.errors?.img && (
            <p>{state.errors.img}</p>
          )
        }
      </label>
      <button type="submit">
        Create
      </button>
    </form>
  )
}