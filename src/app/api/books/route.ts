import { createBook, getBooks } from "@/services/books";

export async function GET() {
  try {
    const books = await getBooks();

    return Response.json(books);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to fetch books.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const book = await createBook(data);

    return Response.json(book, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to create book.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const books = await getBooks({
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
  });

  return Response.json(books);
}
*/