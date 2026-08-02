import { getBooks } from "@/services/books";
import styles from "./adminBooksPage.module.css";

import Link from "next/link";
import AdminBookCard from "./components/AdminBookCard/AdminBookCard";

export default async function AdminBooksPage() {
  const books = await getBooks();

  return (
    <>
      <h1>Admin books</h1>
      <Link className={styles.button} href={"/admin/books/create"}>Create a new book</Link>
      <section className={styles.booksSection}>
        {books.map((book) => <AdminBookCard book={book} key={book.id} />)}
      </section>
    </>
  );
}
