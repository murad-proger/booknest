"use client"

import styles from "./updateBookForm.module.css"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import  { updateBookAction } from "@/actions/books"
import { updateBookSchema, type UpdateBookFormData } from "@/lib/validation"

type Props = {
  book: UpdateBookFormData
}

type Book = z.input<typeof updateBookSchema>

export default function UpdateBookForm ({book}: Props) {
  const {title, author, price, img, id} = book

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting}
  } = useForm<
    Book,
    unknown,
    UpdateBookFormData
  >({
    resolver: zodResolver(updateBookSchema)
  })

  const onSubmit = async (formdata: UpdateBookFormData) => {
    const result = await updateBookAction(formdata)

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
      className={styles.updateBook}
    >
      {
        errors?.root?.serverError && (
          <p>{errors.root.serverError.message}</p>
        )
      }
      <label>
        <span>title:</span>
        <input type="text" {...register("title")} defaultValue={title} />
        {
          errors?.title && (
            <p>{errors.title.message}</p>
          )
        }
      </label>
      <label>
        <span>author:</span>
        <input type="text" {...register("author")} defaultValue={author} />
        {
          errors?.author && (
            <p>{errors.author.message}</p>
          )
        }
      </label>
      <label>
        <span>price:</span>
        <input type="text" {...register("price")} defaultValue={price} placeholder="minimum 1$"/>
        {
          errors?.price && (
            <p>{errors.price.message}</p>
          )
        }
      </label>
      <label>
        <span>img:</span>
        <input type="text" {...register("img")} defaultValue={img} />
      </label>
      <input type="hidden" {...register("id")} defaultValue={id} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}