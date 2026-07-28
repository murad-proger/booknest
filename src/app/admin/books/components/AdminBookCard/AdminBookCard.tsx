import styles from "./adminBookCard.module.css";

import Link from "next/link";

import DeleteBookButton from "../DeleteBookButton/DeleteBookButton";

type BookData = {
  id: number;
  title: string;
  author: string;
  price: number;
  img: string;
};

type AdminBookCardProps = {
  book: BookData;
};

export default function AdminBookCard({ book }: AdminBookCardProps) {
  const { id, title, author, price, img } = book;

  return (
    <div className={styles.book}>
      <img
        className={styles.image}
        src={
          img
            ? img
            : "https://img.freepik.com/premium-vector/blank-cover-book-magazine-template_212889-605.jpg"
        }
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
