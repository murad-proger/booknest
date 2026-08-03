"use client"
import styles from "./CreateBookForm.module.css"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { createBookAction } from "@/actions/books"
import { bookSchema, type BookFormData } from "@/lib/validation"

type Book = z.input<typeof bookSchema>

export default function CreateBookForm () {

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting}
  } = useForm<
    Book,
    unknown,
    BookFormData
  >({
    resolver: zodResolver(bookSchema)
  })

  const onSubmit = async (data: BookFormData) => {
    const result = await createBookAction(data)

    if(!result.success && result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        if(!message) continue
        
        if (field === "form") {
          setError("root.serverError", {
            type: "server",
            message,
          });
          continue;
        }

        setError(
          field as keyof Book,
          {
            type: "server",
            message
          }
        )
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.createBook}
    >
      {
        errors?.root?.serverError && (
          <p className="fieldError"><b>{errors.root.serverError.message}</b></p>
        )
      }
      <label>
        <span>title:</span>
        <input type="text" {...register("title")}/>
        {
          errors?.title && (
            <p className="fieldError">{errors.title.message}</p>
          )
        }
      </label>
      <label>
        <span>author:</span>
        <input type="text" {...register("author")}/>
        {
          errors?.author && (
            <p className="fieldError">{errors.author.message}</p>
          )
        }
      </label>
      <label>
        <span>price:</span>
        <input type="text" {...register("price")} placeholder="minimum 1$"/>
        {
          errors?.price && (
            <p className="fieldError">{errors.price.message}</p>
          )
        }
      </label>
      <label>
        <span>img:</span>
        <input type="text" {...register("img")}/>
        {
          errors?.img && (
            <p className="fieldError">{errors.img.message}</p>
          )
        }
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}