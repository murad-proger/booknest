import { z } from "zod";

export const bookFields = {
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
};

const fileSchema = z
  .custom<File>((file) => file instanceof File, {
    message: "Invalid file",
  })
  .refine(
    (file) => file.type.startsWith("image/"),
    "Only images are allowed"
  )
  .refine(
    (file) => file.size <= 1_000_000,
    "Image must be less than 5MB"
  );

const imagesServerSchema = z.array(fileSchema).default([]);

export const bookSchema = z.object({
  ...bookFields,
  images: imagesServerSchema,
});

export const updateBookClientSchema = z.object({
  ...bookFields,
  id: z.coerce.number().int().positive(),
});

export const updateBookServerSchema = z.object({
  ...bookFields,
  id: z.coerce.number().int().positive(),

  newImages: imagesServerSchema.optional(),
  deletedImageIds: z.array(z.number()).default([]),
});

export type UpdateBookFormData = z.infer<typeof updateBookClientSchema>;