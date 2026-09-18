"use server"

import { createBook, updateBook, deleteBook } from "@/services/books";
import { bookSchema, updateBookServerSchema, bookIdSchema } from "@/lib/validation";
import { z } from "zod";

import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";

interface BookFormErrors {
  title?: string;
  author?: string;
  price?: string;
  images?: string;
  newImages?: string;
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
    images?: string[];
    newImages?: string[];
  };

  return {
    title: fieldErrors.title?.join(". "),
    author: fieldErrors.author?.join(". "),
    price: fieldErrors.price?.join(". "),
    images: fieldErrors.images?.join(". "),
    newImages: fieldErrors.newImages?.join(". "),
  };
}

export async function createBookAction(
  formData: FormData
): Promise<FormActionResult> {
  await requireAdmin();

  const result = bookSchema.safeParse({
    title: formData.get("title"),
    author: formData.get("author"),
    price: formData.get("price"),
    images: formData.getAll("images"),
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
    const fileName = `${randomUUID()}-${image.name}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("book-covers")
      .upload(fileName, buffer, { contentType: image.type });

    if (uploadError) {
      return {
        success: false,
        errors: { form: "Failed to upload image" },
      };
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("book-covers")
      .getPublicUrl(fileName);

    imagePaths.push(urlData.publicUrl);
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
  await requireAdmin();

  const id = formData.get("id");
  const title = formData.get("title");
  const author = formData.get("author");
  const price = formData.get("price");
  const newImages = formData.getAll("newImages").filter(
    (image): image is File =>
      image instanceof File && image.size > 0
  );
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

    const { error: uploadError } = await supabaseAdmin.storage
      .from("book-covers")
      .upload(fileName, buffer, { contentType: image.type });

    if (uploadError) {
      return {
        success: false,
        errors: { form: "Failed to upload image" },
      };
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("book-covers")
      .getPublicUrl(fileName);

    uploadedPaths.push(urlData.publicUrl);
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
  const session = await requireAdmin();

  if (!session) {
    return {
      success: false,
      error: "Forbidden",
    };
  }

  const result = bookIdSchema.safeParse(id);

  if (!result.success) {
    return {
      success: false,
      error: "Invalid book ID",
    };
  }

  try {
    await deleteBook(result.data);

    revalidatePath("/admin/books");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete book",
    };
  }
}