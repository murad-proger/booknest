import { z } from "zod";

import { Role } from "@/generated/prisma/enums";

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

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be 2 characters or more"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userFields = {
  name: z.string().trim().min(2, "Name must be 2 characters or more"),
  email: z.email(),
  role: z.enum(Role),
};

export const updateUserClientSchema = z.object({
  ...userFields,
});

export const updateUserServerSchema = z.object({
  ...userFields,
  id: z.coerce.number().int().positive(),
});