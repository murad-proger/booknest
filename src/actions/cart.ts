"use server";

import { mergeCart, updateCart, getCart } from "@/services/cart";

type CartItemData = {
  id: number;
  quantity: number;
};

export async function mergeCartAction(items: CartItemData[]) {
  return mergeCart(items);
}

export async function updateCartAction(items: CartItemData[]) {
  return updateCart(items);
}

export async function getCartAction() {
  return getCart();
}