"use server"

import { createBook, updateBook, deleteBook } from "@/services/books";
import { bookSchema, updateBookSchema, type BookFormData, type UpdateBookFormData } from "@/lib/validation";
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

type ActionResult = {
  success: boolean;
  error?: string;
};

type FormActionResult = {
  success: boolean;
  errors?: BookFormErrors;
}

function getFieldErrors(
  error: z.ZodError<BookFormData | UpdateBookFormData>
): BookFormErrors {
  const fieldErrors = z.flattenError(error).fieldErrors;

  return {
    title: fieldErrors.title?.join(". "),
    author: fieldErrors.author?.join(". "),
    price: fieldErrors.price?.join(". "),
    img: fieldErrors.img?.join(". "),
  };
}

export async function createBookAction(
  data: BookFormData
): Promise<FormActionResult> {
  const result = bookSchema.safeParse(data)

  if(!result.success) {
    return {
      success: false,
      errors: getFieldErrors(result.error)
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
  } catch {
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
  formdata: UpdateBookFormData
): Promise<FormActionResult> {
  const result = updateBookSchema.safeParse(formdata)

  if(!result.success) {
    return {
      success: false,
      errors: getFieldErrors(result.error)
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
  } catch {
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

export async function deleteBookAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteBook(id);

    revalidatePath("/admin/books");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete book"
    };
  }
}