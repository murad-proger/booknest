import styles from "./CartItemCard.module.css";

import Image from "next/image";
import Counter from "../Counter/Counter";

type CartItemCardProps = {
  book: {
    id: number;
    title: string;
    author: string;
    price: number;
    images: {
      id: number;
      url: string;
    }[];
  };
};

export default function CartItemCard({ book }: CartItemCardProps) {
  const image = book.images[0]?.url || "/images/no-book-cover.jpg";

  return (
    <article className={styles.cartItem}>
      <Image
        src={image}
        alt={book.title}
        width={70}
        height={100}
      />

      <div className={styles.bookInfo}>
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.author}>{book.author}</p>
      </div>

      <Counter />

      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove ${book.title} from cart`}
      >
        ×
      </button>
    </article>
  );
}