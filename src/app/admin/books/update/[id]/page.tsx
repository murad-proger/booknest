import { getBookById } from "@/services/books";
import UpdateBookForm from "../../components/UpdateBookForm/UpdateBookForm"

type Props = {
  params: Promise<{id: string;}>;
};

export default async function AdminBookUpdatePage ({params}: Props) {
  const {id} = await params

  const book = await getBookById(Number(id))

  if(!book) {
    throw new Error('Cannot updating book. DB Fetch error.')
  }

  return (
    <>
      <h1>Update book</h1>
      <UpdateBookForm book={book} />
    </>
  )
}