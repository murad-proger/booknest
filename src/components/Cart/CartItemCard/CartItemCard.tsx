import styles from "./CartItemCard.module.css";

import Image from "next/image";

import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { removeFromCart } from "@/lib/features/cart/cartSlice";


import type { Book } from "@/types/book";
import Counter from "../Counter/Counter";

type CartItemCardProps = {
  book: Book
};

export default function CartItemCard({ book }: CartItemCardProps) {
  const dispatch = useAppDispatch()

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

      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove ${book.title} from cart`}
        onClick={() => dispatch(removeFromCart(book.id))}
      >
        ×
      </button>
    </article>
  );
}