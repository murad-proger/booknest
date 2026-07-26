"use server"

import { prisma } from "@/lib/prisma"

interface Errors {
  title?: string;
  author?: string;
  price?: string;
}

type CreateBookActionResult = {
  success: boolean;
  errors?: Errors;
}

export async function createBookAction(
  prevState: CreateBookActionResult,
  formdata: FormData
): Promise<CreateBookActionResult> {
  const title = String(formdata.get('title') ?? "").trim()
  const author = String(formdata.get('author') ?? "").trim()
  const price = Number(formdata.get('price'))
  const img = String(formdata.get('img') ?? "").trim()

  const errors: Errors = {}

  if(!title) {
    errors.title = "title is required"
  }

  if(!author) {
    errors.author = "author is required"
  }

  if(Number.isNaN(price) || price < 1) {
    errors.price = "price is required and must be 1$ or more"
  }

  if(Object.keys(errors).length > 0) {
    return {
      success: false,
      errors
    }
  }

  try {
    await prisma.book.create({
      data: {
        title,
        author,
        price,
        img,
      }
    })
  } catch (e) {
    return {
      success: false,
      errors: {
        title: 'Failed to create book'
      }
    }
  }

  return {
    success: true
  }
}