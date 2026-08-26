import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createOrderFromCart() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const total = cart.items.reduce(
      (sum, item) =>
        sum + item.book.price * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        total: new Prisma.Decimal(total),
        items: {
          create: cart.items.map((item) => ({
            bookId: item.bookId,
            title: item.book.title,
            quantity: item.quantity,
            price: new Prisma.Decimal(item.book.price),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  });
}