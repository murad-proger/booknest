import styles from "./adminBookCard.module.css";

import Link from "next/link";
import Image from "next/image";

import DeleteBookButton from "../DeleteBookButton/DeleteBookButton";

type BookData = {
  id: number;
  title: string;
  author: string;
  price: number;
  images: {
    id: number;
    url: string;
  }[];
};

type AdminBookCardProps = {
  book: BookData;
};

export default function AdminBookCard({ book }: AdminBookCardProps) {
  const { id, title, author, price, images } = book;

  return (
    <div className={styles.book}>
      <Image
        className={styles.image}
        src={images[0]?.url ?? "/images/no-book-cover.jpg"}
        alt={`${author} - ${title}`}
        width={100}
        height={150}
      />

      <div className={styles.content}>
        <div className={styles.title}>
          <strong>Title:</strong> {title}
        </div>

        <div className={styles.author}>
          <strong>Author:</strong> {author}
        </div>

        <div className={styles.price}>
          <strong>Price:</strong> ${price}
        </div>
      </div>
      <div className={styles.bottom}>
        <DeleteBookButton id={id} />
        <Link className={styles.updateButton} href={`/admin/books/update/${id}`}>Update</Link>
      </div>
    </div>
  );
}
