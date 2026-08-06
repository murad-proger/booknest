import { z } from "zod";

export const bookFields = {
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
};

const imageSchema = z
  .unknown()
  .refine(
    (file) =>
      file instanceof File === false ||
      file.size === 0 ||
      file.type.startsWith("image/"),
    "Only images are allowed"
  )
  .refine(
    (file) =>
      file instanceof File === false ||
      file.size <= 5_000_000,
    "Image must be less than 5MB"
  )
  .transform((file) => {
    if (file instanceof File && file.size > 0) {
      return file;
    }

    return "";
  });

export const bookSchema = z.object({
  ...bookFields,
  img: imageSchema
});

export const updateBookClientSchema = z.object({
  ...bookFields,
  id: z.coerce.number().int().positive(),
});

export const updateBookServerSchema = z.object({
  ...bookFields,
  id: z.coerce.number().int().positive(),

  img: imageSchema
});

export type UpdateBookFormData = z.infer<typeof updateBookClientSchema>;