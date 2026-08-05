import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type BookData = {
  title: string,
  author: string,
  price: number,
  img: string,
}

type CreateBookData = BookData

type UpdateBookData = Partial<BookData>

export type GetBooksOptions = {
  search?: string;
  sort?: string;
  authors?: string | string[];
  priceMin?: number;
  priceMax?: number;
}

export async function getAuthors() {
  const authors = await prisma.book.findMany({
    distinct: ["author"],
    select: {
      author: true,
    },
    orderBy: {
      author: "asc",
    },
  });

  return authors.map(({ author }) => author);
}

export async function getBooks(options: GetBooksOptions  = {}) {
  const where: Prisma.BookWhereInput = {};
  
  const {
    sort,
    search,
    priceMin,
    priceMax,
    authors,
  } = options

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

  if(search) {
    where.title = {
      contains: search,
      mode: 'insensitive'
    }
  }

  const normalizedAuthors = authors
    ? Array.isArray(authors)
      ? authors
      : [authors]
    : [];

  if(normalizedAuthors.length > 0) {
    where.author = {
      in: normalizedAuthors
    }
  }

  if(priceMin !== undefined || priceMax !== undefined) {
    where.price = {}

    if(priceMin !== undefined) {
      where.price.gte = Number(priceMin)
    }

    if(priceMax !== undefined) {
      where.price.lte = Number(priceMax)
    }
  }

  return await prisma.book.findMany({
    where,
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