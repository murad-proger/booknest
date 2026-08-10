import styles from "./CartItemCard.module.css";

import Image from "next/image";

import { useAppSelector } from "@/lib/hooks";


import type { Book } from "@/types/book";
import Counter from "../Counter/Counter";
import RemoveFromCartButton from "../RemoveFromCartButton/RemoveFromCartButton";

type CartItemCardProps = {
  book: Book
};

export default function CartItemCard({ book }: CartItemCardProps) {
  const image = book.images[0]?.url || "/images/no-book-cover.jpg";

  const quantity = useAppSelector(
    state => state.cart.items.find(item => item.id === book.id)?.quantity ?? 0
  );

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
        <p className={styles.price}>${book.price}</p>
      </div>

      <Counter id={book.id} quantity={quantity} />

      <RemoveFromCartButton title={book.title} id={book.id} />
    </article>
  );
}