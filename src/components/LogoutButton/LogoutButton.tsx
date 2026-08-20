"use client";

import styles from "./LogoutButton.module.css";

import { signOut } from "next-auth/react";

import { clearCart } from "@/lib/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/hooks";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    dispatch(clearCart());

    localStorage.removeItem("cart");
    localStorage.removeItem("cart-owner");

    await signOut({
      redirectTo: "/",
    });
  };

  return (
    <button
      className={styles.logout}
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}