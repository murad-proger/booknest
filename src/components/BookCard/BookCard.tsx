import styles from "./BookCard.module.css";

import type { Prisma } from "@/generated/prisma/client";
import Image from "next/image";

type Props = {
  book: Prisma.BookGetPayload<{
    include: {
      images: true;
    };
  }>;
};

export default function BookCard({ book }: Props) {
  return (
    <article className={styles.card}>
      <Image
        className={styles.image}
        src={book.images ? book.images[0].url : "/images/no-book-cover.jpg"}
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