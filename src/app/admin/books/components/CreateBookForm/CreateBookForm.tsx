"use client";

import styles from "./CreateBookForm.module.css";

import { createBookAction } from "@/actions/books";
import { useForm } from "react-hook-form";

type CreateBookForm = {
  title: string;
  author: string;
  price: string;
  images: FileList;
};

export default function CreateBookForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateBookForm>();

  const onSubmit = async (data: CreateBookForm) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("price", data.price);

    for (const image of data.images) {
      formData.append("images", image);
    }

    await createBookAction(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.createBook}
    >
      <label>
        <span>title:</span>
        <input type="text" {...register("title")} />
      </label>

      <label>
        <span>author:</span>
        <input type="text" {...register("author")} />
      </label>

      <label>
        <span>price:</span>
        <input
          type="text"
          {...register("price")}
          placeholder="minimum 1$"
        />
      </label>

      <label>
        <span>image:</span>
        <input
          type="file"
          accept="image/*"
          multiple
          {...register("images")}
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create"}
      </button>
    </form>
  );
}