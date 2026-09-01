import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

type CartItemData = {
  id: number;
  quantity: number;
};

export async function getCart() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  return prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: true,
    },
  });
}

export async function mergeCart(items: CartItemData[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const validItems = items.filter(
      (item) => item.quantity > 0
    );

    const bookIds = validItems.map((item) => item.id);

    const books = await tx.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingBookIds = new Set(
      books.map((book) => book.id)
    );

    for (const item of validItems) {
      if (!existingBookIds.has(item.id)) continue;

      await tx.cartItem.upsert({
        where: {
          cartId_bookId: {
            cartId: cart.id,
            bookId: item.id,
          },
        },
        update: {
          quantity: {
            increment: item.quantity,
          },
        },
        create: {
          cartId: cart.id,
          bookId: item.id,
          quantity: item.quantity,
        },
      });
    }

    return tx.cart.findUnique({
      where: {
        id: cart.id,
      },
      include: {
        items: true,
      },
    });
  });
}

export async function updateCart(items: CartItemData[]) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const validItems = items.filter(
      (item) => item.quantity > 0
    );

    const bookIds = validItems.map((item) => item.id);

    const books = await tx.book.findMany({
      where: {
        id: {
          in: bookIds,
        },
      },
      select: {
        id: true,
      },
    });

    const existingBookIds = new Set(
      books.map((book) => book.id)
    );

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const itemsToCreate = validItems
      .filter((item) => existingBookIds.has(item.id))
      .map((item) => ({
        cartId: cart.id,
        bookId: item.id,
        quantity: item.quantity,
      }));

    if (itemsToCreate.length > 0) {
      await tx.cartItem.createMany({
        data: itemsToCreate,
      });
    }

    return tx.cart.findUnique({
      where: {
        id: cart.id,
      },
      include: {
        items: true,
      },
    });
  });
}

export async function clearCart() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    return;
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
}

export async function clearCartByUserId(
  userId: number,
  tx: Prisma.TransactionClient = prisma
) {
  const cart = await tx.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    return;
  }

  await tx.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });
}