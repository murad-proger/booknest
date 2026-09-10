import Link from "next/link";
import { getLatestBooks } from "@/services/books";
import BookCard from "@/components/BookCard/BookCard";
import styles from "./NewArrivals.module.css";

export default async function NewArrivals() {
  const books = await getLatestBooks(4);

  if (books.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>New arrivals</h2>
        <Link href="/books" className={styles.link}>
          See all books
        </Link>
      </div>

      <div className={styles.grid}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}