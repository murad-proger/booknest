"use server"

import { createBook, updateBook, deleteBook } from "@/services/books";
import { bookSchema, updateBookSchema, type UpdateBookFormData } from "@/lib/validation";
import { z } from "zod";

import { writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

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
  error: z.ZodError
): BookFormErrors {
  const fieldErrors = z.flattenError(error).fieldErrors as {
    title?: string[];
    author?: string[];
    price?: string[];
    img?: string[];
  };

  return {
    title: fieldErrors.title?.join(". "),
    author: fieldErrors.author?.join(". "),
    price: fieldErrors.price?.join(". "),
    img: fieldErrors.img?.join(". "),
  };
}

export async function createBookAction(
  formData: FormData
): Promise<FormActionResult> {
  const title = formData.get("title");
  const author = formData.get("author");
  const price = formData.get("price");
  const img = formData.get("img");

  const result = bookSchema.safeParse({
    title,
    author,
    price,
    img: img instanceof File ? img : "",
  });

  if (!result.success) {
    return {
      success: false,
      errors: getFieldErrors(result.error),
    };
  }

  let imgPath = "";

  if (result.data.img instanceof File) {
    const buffer = Buffer.from(
      await result.data.img.arrayBuffer()
    );

    const fileName = `${randomUUID()}-${result.data.img.name}`;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads/books",
      fileName
    );

    await writeFile(uploadPath, buffer);

    imgPath = `/uploads/books/${fileName}`;
  }

  try {
    await createBook({
      title: result.data.title,
      author: result.data.author,
      price: result.data.price,
      img: imgPath,
    });
  } catch {
    return {
      success: false,
      errors: {
        form: "Failed to create book",
      },
    };
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