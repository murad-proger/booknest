"use client"

import styles from "./updateBookForm.module.css"

import Image from "next/image"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import  { updateBookAction } from "@/actions/books"
import { updateBookClientSchema, type UpdateBookFormData } from "@/lib/validation"

type Book = UpdateBookFormData & {
  images: { id: number; url: string; }[];
};

type FormValues = z.output<typeof updateBookClientSchema>;

type Props = {
  book: Book;
};

export default function UpdateBookForm ({book}: Props) {
  const {title, author, price, images, id} = book

  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [newImagesError, setNewImagesError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting}
  } = useForm<
      z.input<typeof updateBookClientSchema>,
      unknown,
      FormValues
  >({
    resolver: zodResolver(updateBookClientSchema),
  });

  const onSubmit = async (
    _: FormValues,
    event?: React.BaseSyntheticEvent
  ) => {
    if (!event?.target) return;

    setNewImagesError(null);

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const result = await updateBookAction(formData);

    if (!result.success && result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        if (!message) continue;

        if (field === "form") {
          setError("root.serverError", {
            type: "server",
            message,
          });
          continue;
        }

        if (field === "newImages") {
          setNewImagesError(message);
          continue;
        }

        setError(field as "title" | "author" | "price", {
          type: "server",
          message,
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.updateBook}
    >
      {
        errors?.root?.serverError && (
          <p className="fieldError">{errors.root.serverError.message}</p>
        )
      }
      <label>
        <span>title:</span>
        <input type="text" {...register("title")} defaultValue={title} />
        {errors?.title && (
            <p className="fieldError">{errors.title.message}</p>
          )
        }
      </label>
      <label>
        <span>author:</span>
        <input type="text" {...register("author")} defaultValue={author} />
        {errors?.author && (
            <p className="fieldError">{errors.author.message}</p>
          )
        }
      </label>
      <label>
        <span>price:</span>
        <input type="text" {...register("price")} defaultValue={price} placeholder="minimum 1$"/>
        {errors?.price && (
            <p className="fieldError">{errors.price.message}</p>
          )
        }
      </label>
      <label>
        {images.length > 0 ? (<span>Current images:</span>) : (<span>Add images:</span>)}
        <div className={styles.images}>
          {images
            .filter((image) => !deletedImageIds.includes(image.id))
            .map((image) => (
              <div key={image.id} className={styles.imageWrapper}>
                <Image
                  src={image.url}
                  alt={title}
                  width={80}
                  height={120}
                  className={styles.image}
                />

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() =>
                    setDeletedImageIds((prev) => [...prev, image.id])
                  }
                  aria-label="Delete image"
                >
                  ×
                </button>
              </div>
          ))}
        </div>

        <input
          type="file"
          name="newImages"
          accept="image/*"
          multiple
        />
        {newImagesError  && (
            <p className="fieldError">{newImagesError }</p>
          )
        }
      </label>
      <input type="hidden" {...register("id")} defaultValue={id} />
      <input
        type="hidden"
        name="deletedImageIds"
        value={JSON.stringify(deletedImageIds)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  )
}