"use server"

import { createBook, updateBook } from "@/lib/books";
import { bookSchema, updateBookSchema } from "@/lib/validation";
import { z } from "zod";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface BookFormErrors {
  title?: string;
  author?: string;
  price?: string;
  img?: string;
  form?: string;
}

export type CreateBookActionResult = {
  success: boolean;
  errors?: BookFormErrors;
}

export async function createBookAction(
  _prevState: CreateBookActionResult,
  formData: FormData
): Promise<CreateBookActionResult> {
  const result = bookSchema.safeParse({
    title: formData.get('title'),
    author: formData.get('author'),
    price: formData.get('price'),
    img: formData.get('img'),
  })

  if(!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors
        
    const title = fieldErrors.title?.join('. ')
    const author = fieldErrors.author?.join('. ')
    const price = fieldErrors.price?.join('. ')
    const img = fieldErrors.img?.join('. ')

    return {
      success: false,
      errors: {
        title,
        author,
        price,
        img
      }
    }
  }

  const existingBook = await prisma.book.findFirst({
    where: {
      title: result.data.title,
      author: result.data.author,
    }
  })

  if(existingBook) {
    return {
      success: false,
      errors: {
        form: 'This book already exists'
      }
    }
  }

  try {
    await createBook(result.data)
  } catch (_error) {
    return {
      success: false,
      errors: {
        form: 'Failed to create book'
      }
    }
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}

export async function updateBookAction(
  _prevState: CreateBookActionResult,
  formData: FormData
): Promise<CreateBookActionResult> {
  const result = updateBookSchema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    author: formData.get('author'),
    price: formData.get('price'),
    img: formData.get('img')
  })

  if (!result.success) {
    const fieldErrors = z.flattenError(result.error).fieldErrors

    const title = fieldErrors.title?.join('. ')
    const author = fieldErrors.author?.join('. ')
    const price = fieldErrors.price?.join('. ')
    const img = fieldErrors.img?.join('. ')

    return {
      success: false,
      errors: {
        title,
        author,
        price,
        img
      }
    }
  }

  const {id, ...data} = result.data

  const existingBook = await prisma.book.findUnique({
    where: {
      id
    }
  })

  if(!existingBook) {
    return {
      success: false,
      errors: {
        form: 'Book not found'
      }
    }
  }

  try {
    await updateBook(id, data)
  } catch (_error) {
    return {
      success: false,
      errors: {
        form: 'Failed to update book'
      }
    }
  }

  revalidatePath("/admin/books");
  redirect("/admin/books");
}