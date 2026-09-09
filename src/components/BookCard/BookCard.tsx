import styles from "./BookCard.module.css";
import Link from "next/link";
import type { Prisma } from "@/generated/prisma/client";
import Image from "next/image";
import Card from "@/components/ui/Card/Card";
import AddToCartButton from "../AddToCartButton/AddToCartButton";

type Props = {
  book: Prisma.BookGetPayload<{ include: { images: true } }>;
};

export default function BookCard({ book }: Props) {
  return (
    <Card variant="storefront" className={styles.card}>
      <Link href={`/books/${book.id}`} className={styles.imageLink}>
        <Image
          className={styles.image}
          src={book.images[0]?.url ?? "/images/no-book-cover.jpg"}
          alt={`${book.author} - ${book.title}`}
          width={250}
          height={290}
        />
      </Link>

      <div className={styles.content}>
        <Link href={`/books/${book.id}`}>
          <h3 className={styles.title}>{book.title}</h3>
        </Link>

        <p className={styles.author}>{book.author}</p>

        <div className={styles.bottom}>
          <p className={styles.price}>${book.price.toFixed(2)}</p>
          <AddToCartButton id={book.id} />
        </div>
      </div>
    </Card>
  );
}