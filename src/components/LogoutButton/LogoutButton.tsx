"use client";

import { signOut } from "next-auth/react";

import { clearCart } from "@/lib/features/cart/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import Button from "../ui/Button/Button";

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
    <Button variant="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
}