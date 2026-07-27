import Link from "next/link";


export default function AdminBooksPage () {
  return (
    <>
      <h1>Admin books</h1>
      <Link href={'/admin/books/create'}>Create a new book</Link>
    </>
  )
}