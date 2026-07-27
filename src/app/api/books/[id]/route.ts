import { deleteBook, getBookById, updateBook } from "@/lib/books"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await deleteBook(Number(id));

    return Response.json(book);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to delete book.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await request.json();

    const updatedBook = await updateBook(Number(id), data);

    return Response.json(updatedBook);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to update book.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const book = await getBookById(Number(id));

    return Response.json(book);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        message: "Failed to fetch book.",
      },
      {
        status: 500,
      }
    );
  }
}