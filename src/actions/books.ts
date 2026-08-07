"use server"

import { createBook, updateBook, deleteBook } from "@/services/books";
import { bookSchema, updateBookServerSchema } from "@/lib/validation";
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
  const images = formData.getAll("images");

  const result = bookSchema.safeParse({
    title,
    author,
    price,
    images,
  });

  if (!result.success) {
    return {
      success: false,
      errors: getFieldErrors(result.error),
    };
  }

  const imagePaths: string[] = [];

  for (const image of result.data.images) {
    const buffer = Buffer.from(await image.arrayBuffer());
    // Buffer — это объект Node.js для хранения и передачи бинарных данных (байтов). Т.е. это "контейнер с содержимым файла", который Node.js умеет записывать на диск.
    // arrayBuffer - "Возьми этот файл и дай мне его содержимое в виде набора байтов".

    const fileName = `${randomUUID()}-${image.name}`;

    const uploadPath = path.join(
      process.cwd(), // Current Working Directory
      "public/uploads/books",
      fileName
    );

    await writeFile(uploadPath, buffer); //writeFile(путь, данные)

    imagePaths.push(`/uploads/books/${fileName}`);
  }

  try {
    await createBook({
      title: result.data.title,
      author: result.data.author,
      price: result.data.price,
      images: imagePaths,
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
  formData: FormData
): Promise<FormActionResult> {
  const id = formData.get("id");
  const title = formData.get("title");
  const author = formData.get("author");
  const price = formData.get("price");
  const newImages = formData.getAll("newImages");
  const deletedImageIdsRaw = formData.get("deletedImageIds");

  const deletedImageIds = deletedImageIdsRaw
    ? JSON.parse(deletedImageIdsRaw as string)
    : [];

  const result = updateBookServerSchema.safeParse({
    id,
    title,
    author,
    price,
    newImages,
    deletedImageIds,
  });

  if (!result.success) {
    return {
      success: false,
      errors: getFieldErrors(result.error),
    };
  }

  const {
    id: bookId,
    newImages: validatedNewImages,
    deletedImageIds: validatedDeletedImageIds,
    ...bookData
  } = result.data;

  const existingBook = await prisma.book.findUnique({
    where: {
      id: bookId,
    },
  });

  if (!existingBook) {
    return {
      success: false,
      errors: {
        form: "Book not found",
      },
    };
  }

  const uploadedPaths: string[] = [];

  for (const image of validatedNewImages ?? []) {
    const buffer = Buffer.from(await image.arrayBuffer());

    const fileName = `${randomUUID()}-${image.name}`;

    const uploadPath = path.join(
      process.cwd(),
      "public/uploads/books",
      fileName
    );

    await writeFile(uploadPath, buffer);

    uploadedPaths.push(`/uploads/books/${fileName}`);
  }

  try {
    await updateBook(bookId, {
      ...bookData,
      newImages: uploadedPaths,
      deletedImageIds: validatedDeletedImageIds,
    });
  } catch {
    return {
      success: false,
      errors: {
        form: "Failed to update book",
      },
    };
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