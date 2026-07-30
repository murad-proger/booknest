import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  author: z.string().trim().min(1, 'Author is required'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  img: z.union([
    z.literal(""),
    z.url(),
  ])
})

export const updateBookSchema = bookSchema.extend({
  id: z.coerce.number().int().positive()
})

// export type BookFormData = z.infer<typeof bookSchema>