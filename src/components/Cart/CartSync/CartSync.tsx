"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

import {
  getCartAction,
  mergeCartAction,
  updateCartAction,
} from "@/actions/cart";

import { hydrateCart } from "@/lib/features/cart/cartSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";

const CART_OWNER_KEY = "cart-owner";

export default function CartSync() {
  const { data: session, status } = useSession();

  const dispatch = useAppDispatch();

  const items = useAppSelector(
    (state) => state.cart.items
  );

  const hydrated = useAppSelector(
    (state) => state.cart.hydrated
  );

  const userId = session?.user?.id;

  const syncedUserId = useRef<string | null>(null);

  // Показывает, что сейчас выполняется первоначальная синхронизация корзины.
  const syncingUserId = useRef<string | null>(null);

  // Не даёт отправить обратно на сервер корзину,
  // которую мы только что получили с сервера.
  const skipNextUpdate = useRef(false);

  // Синхронизация корзины после входа пользователя или перезагрузки страницы.
  useEffect(() => {
    if (
      status !== "authenticated" ||
      !userId ||
      !hydrated ||
      syncedUserId.current === userId ||
      syncingUserId.current === userId
    ) {
      return;
    }

    const syncCart = async () => {
      syncingUserId.current = userId;

      try {
        const storedOwnerId = localStorage.getItem(
          CART_OWNER_KEY
        );

        let cart;

        if (storedOwnerId === userId) {
          // Пользователь уже входил в этом браузере.
          // Получаем его актуальную корзину с сервера.
          cart = await getCartAction();
        } else {
          // Новый вход:
          // объединяем гостевую корзину с корзиной пользователя.
          cart = await mergeCartAction(items);
        }

        // Следующее изменение Redux произойдёт из-за hydrateCart().
        // Это не изменение пользователя, поэтому его не нужно
        // отправлять обратно на сервер через updateCartAction().
        skipNextUpdate.current = true;

        dispatch(
          hydrateCart(
            cart?.items.map((item) => ({
              id: item.bookId,
              quantity: item.quantity,
            })) ?? []
          )
        );

        localStorage.setItem(
          CART_OWNER_KEY,
          userId
        );

        syncedUserId.current = userId;
      } catch (error) {
        console.error(
          "Failed to sync cart:",
          error
        );
      } finally {
        syncingUserId.current = null;
      }
    };

    syncCart();
  }, [
    status,
    userId,
    hydrated,
    items,
    dispatch,
  ]);

  // Сохраняем изменения корзины на сервере после действий пользователя.
  useEffect(() => {
    if (
      status !== "authenticated" ||
      !userId ||
      !hydrated ||
      syncedUserId.current !== userId
    ) {
      return;
    }

    // hydrateCart() изменил Redux после получения данных с сервера.
    // Это изменение уже сохранено на сервере, поэтому ничего
    // дополнительно отправлять не нужно.
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        await updateCartAction(items);
      } catch (error) {
        console.error(
          "Failed to update cart:",
          error
        );
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    items,
    status,
    userId,
    hydrated,
  ]);

  return null;
}