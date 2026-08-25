import { createBook, getBooks } from "@/services/books";
import { requireAdmin } from "@/lib/auth-utils";

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
  const session = await requireAdmin();

  if(!session) {
    return Response.json(
      {message: "Forbidden"},
      {status: 403}
    )
  }

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