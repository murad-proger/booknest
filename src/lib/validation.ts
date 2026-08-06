import { z } from "zod";

export const bookFields = {
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
};

export const bookSchema = z.object({
  ...bookFields,
  img: z.union([
    z.instanceof(File),
    z.literal("")
  ])
});

export const updateBookSchema = z.object({
  ...bookFields,
  img: z.string(),
  id: z.coerce.number().int().positive()
});

export type UpdateBookFormData = z.infer<typeof updateBookSchema>;