import { prisma } from "@/lib/prisma"

export type BookData = {
  title: string,
  author: string,
  price: number,
  img: string,
}

type CreateBookData = BookData

type UpdateBookData = Partial<BookData>

type GetBooksOptions = {
  search?: string;
  sort?: string;
}

export async function getBooks(options: GetBooksOptions  = {}) {
  const {sort, search} = options

  let orderBy;

  switch(sort) {
    case 'title-asc':
      orderBy = {
        title: 'asc' as const
      }
      break

    case 'title-desc':
      orderBy = {
        title: 'desc' as const
      }
      break

    case 'price-asc':
      orderBy = {
        price: 'asc' as const
      }
      break

    case 'price-desc':
      orderBy = {
        price: 'desc' as const
      }
      break
  }

  return await prisma.book.findMany({
    where: search ? {
      title: {
        contains: search,
        mode: 'insensitive'
      }
    } : undefined,

    orderBy
  })
}

export async function createBook(data: CreateBookData) {
  return await prisma.book.create({
    data
  })
}

export async function updateBook(id: number, data: UpdateBookData) {
  return await prisma.book.update({
    data,
    where: {
      id
    }
  })
}

export async function getBookById(id: number) {
  return await prisma.book.findUnique({
    where: {
      id
    }
  })
}

export async function deleteBook(id: number) {
  return await prisma.book.delete({
    where: {
      id
    }
  })
}