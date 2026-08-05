import type { Book } from "@/generated/prisma/client";

import styles from "./BookCard.module.css";

type Props = {
  book: Book;
};

export default function BookCard({ book }: Props) {
  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={
          book.img
            ? book.img
            : "https://img.freepik.com/premium-vector/blank-cover-book-magazine-template_212889-605.jpg"
        }
        alt={`${book.author} - ${book.title}`}
        width={140}
        height={200}
      />

      <div className={styles.content}>
        <h3 className={styles.title}>{book.title}</h3>

        <p className={styles.author}>{book.author}</p>

        <p className={styles.price}>
          ${book.price.toFixed(2)}
        </p>
      </div>
    </article>
  );
}