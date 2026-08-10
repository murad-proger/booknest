"use client";

import { useEffect, useState } from "react";
import styles from "./cartPage.module.css";
import CartItemCard from "@/components/Cart/CartItemCard/CartItemCard";

type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  images: {
    id: number;
    url: string;
  }[];
};

export default function CartPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    if (storedCart.length === 0) {
      return;
    }

    const getBooks = async () => {
      const response = await fetch("/api/books");

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data: Book[] = await response.json();

      const cartBooks = data.filter((book) =>
        storedCart.includes(book.id)
      );

      setBooks(cartBooks);
    };

    getBooks();
  }, []);

  const total = books.reduce(
    (sum, book) => sum + book.price,
    0
  );

  return (
    <main className="cartPage">
      <h1>Cart</h1>

      {books.length === 0 ? (
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