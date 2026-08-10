"use client";

import styles from "./cartPage.module.css";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";

import type { Book } from "@/types/book";
import CartItemCard from "@/components/Cart/CartItemCard/CartItemCard";

export default function CartPage() {
  const [books, setBooks] = useState<Book[]>([]);

  const cartItems = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    const getBooks = async () => {
      if (cartItems.length === 0) {
        return;
      }

      const response = await fetch("/api/books");

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data: Book[] = await response.json();

      const cartBooks = data.filter((book) =>
        cartItems.some((item) => item.id === book.id)
      );

      setBooks(cartBooks);
    };

    getBooks();
  }, [cartItems]);

  const total = books.reduce((sum, book) => {
    const cartItem = cartItems.find((item) => item.id === book.id);

    return sum + book.price * (cartItem?.quantity ?? 0);
  }, 0);

  const isEmpty = cartItems.length === 0;

  return (
    <main className="cartPage">
      <h1>Cart</h1>

      {isEmpty ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {books.map((book) => (
            <CartItemCard
              key={book.id}
              book={book}
            />
          ))}

          <div className={styles.cartTotal}>
            <span>Total:</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </main>
  );
}