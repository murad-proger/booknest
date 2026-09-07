import { getBooks } from "@/services/books";

import LinkButton from "@/components/ui/LinkButton/LinkButton";
import AdminBookCard from "./components/AdminBookCard/AdminBookCard";
import styles from "./adminBooksPage.module.css";

export default async function AdminBooksPage() {
  const books = await getBooks();

  return (
    <>
      <h1>Admin books</h1>
      <LinkButton href="/admin/books/create" className={styles.createButton}>
        Create a new book
      </LinkButton>
      <section className={styles.booksSection}>
        {books.map((book) => <AdminBookCard book={book} key={book.id} />)}
      </section>
    </>
  );
}