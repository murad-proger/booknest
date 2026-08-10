"use client";

import styles from "./CreateBookForm.module.css";

import { createBookAction } from "@/actions/books";
import { bookSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

type FormValues = z.output<typeof bookSchema>

export default function CreateBookForm() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<
    z.input<typeof bookSchema>,
    unknown,
    FormValues
  >({
    resolver: zodResolver(bookSchema)
  });

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("price", String(data.price));

    for (const image of data.images) {
      formData.append("images", image);
    }

    const result = await createBookAction(formData);

    if(!result.success && result.errors) {
      for(const [field, message] of Object.entries(result.errors)) {
        if(!message) continue

        if(field === "form") {
          setError("root.serverError", {
            type: "server",
            message
          })

          continue
        }

        setError(field as keyof FormValues, {
          type: "server",
          message
        })
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.createBook}
    >
      {errors.root?.serverError && (
        <p className="fieldError">{errors.root.serverError.message}</p>
      )}
      <label>
        <span>title:</span>
        <input type="text" {...register("title")} />
        {errors.title && (
          <p className="fieldError">{errors.title.message}</p>
        )}
      </label>

      <label>
        <span>author:</span>
        <input type="text" {...register("author")} />
        {errors.author && (
          <p className="fieldError">{errors.author.message}</p>
        )}
      </label>

      <label>
        <span>price:</span>
        <input
          type="text"
          {...register("price")}
          placeholder="minimum 1$"
        />
        {errors.price && (
          <p className="fieldError">{errors.price.message}</p>
        )}
      </label>

      <label>
        <span>image:</span>
        <Controller
          name="images"
          control={control}
          render={({field}) => (
            <>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>{
                  field.onChange(
                    Array.from(event.target.files ?? [])
                  );
                }}
              />
              {errors.images && (
                <p className="fieldError">{errors.images.message}</p>
              )}
            </>
          )}
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}