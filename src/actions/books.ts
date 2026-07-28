"use server"

import { createBook, updateBook } from "@/lib/books";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface Errors {
  title?: string;
  author?: string;
  price?: string;
}

type CreateBookActionResult = {
  success: boolean;
  errors?: Errors;
}

export async function createBookAction(
  prevState: CreateBookActionResult,
  formdata: FormData
): Promise<CreateBookActionResult> {
  const title = String(formdata.get('title') ?? "").trim()
  const author = String(formdata.get('author') ?? "").trim()
  const price = Number(formdata.get('price'))
  const img = String(formdata.get('img') ?? "").trim()

  const errors: Errors = {}

  if(!title) {
    errors.title = "title is required"
  }

  if(!author) {
    errors.author = "author is required"
  }

  if(Number.isNaN(price) || price < 1) {
    errors.price = "price is required and must be 1$ or more"
  }

  if(Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    }
  }

  try {
    await createBook({
      title,
      author,
      price,
      img
    })
  } catch (e) {
    return {
      success: false,
      errors: {
        title: 'Failed to create book'
      }
    }
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function updateBookAction(
  prevState: CreateBookActionResult,
  formdata: FormData
): Promise<CreateBookActionResult> {
  const title = String(formdata.get('title') ?? "").trim()
  const author = String(formdata.get('author') ?? "").trim()
  const price = Number(formdata.get('price'))
  const img = String(formdata.get('img') ?? "").trim()
  const id = Number(formdata.get('id'))

  const errors: Errors = {}

  if(!title) {
    errors.title = "title is required"
  }

  if(!author) {
    errors.author = "author is required"
  }

  if(Number.isNaN(price) || price < 1) {
    errors.price = "price is required and must be 1$ or more"
  }

  if (Number.isNaN(id)) {
    return {
      success: false,
      errors: {
        title: "Invalid book id",
      },
    };
  }

  if(Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    }
  }

  const data = {
    title,
    author,
    price,
    img
  }

  try {
    await updateBook(id, data)
  } catch (e) {
    return {
      success: false,
      errors: {
        title: 'Failed to update book'
      }
    }
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}