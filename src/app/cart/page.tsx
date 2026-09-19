"use client";

import styles from "./cartPage.module.css";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/hooks";

import type { Book } from "@/types/book";
import CartItemCard from "@/components/Cart/CartItemCard/CartItemCard";
import Button from "@/components/ui/Button/Button";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import EmptyCart from "@/components/Cart/EmptyCart/EmptyCart";

async function fetchBooks(): Promise<Book[]> {
  const response = await fetch("/api/books");

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  return response.json();
}

export default function CartPage() {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { data: session } = useSession();
  const cartItems = useAppSelector((state) => state.cart.items);

  const { data: allBooks = [], isPending } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
    enabled: cartItems.length > 0,
  });

  const books = allBooks.filter((book) =>
    cartItems.some((item) => item.id === book.id)
  );

  const total = books.reduce((sum, book) => {
    const cartItem = cartItems.find((item) => item.id === book.id);

    return sum + book.price * (cartItem?.quantity ?? 0);
  }, 0);

  const isEmpty = cartItems.length === 0;

  const handleCheckout = async () => {
    try {
      setIsCheckoutLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      window.location.href = data.session.url;
    } catch (error) {
      console.error("Checkout error:", error);
      setIsCheckoutLoading(false);
    }
  };

  return (
    <main>
      <h1>Cart</h1>

      {isEmpty ? (
        <EmptyCart />
      ) : isPending ? (
        <p>Loading...</p>
      ) : (
        <>
          {books.map((book) => (
            <CartItemCard key={book.id} book={book} />
          ))}

          <div className={styles.cartTotal}>
            <span>Total:</span>
            <strong>${total.toFixed(2)}</strong>

            {session?.user ? (
              <Button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? "Processing..." : "Pay"}
              </Button>
            ) : (
              <LinkButton variant="secondary" href="/login">
                Log in to pay
              </LinkButton>
            )}
          </div>
        </>
      )}
    </main>
  );
}