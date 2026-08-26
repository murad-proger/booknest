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
        sum.add(item.book.price.mul(item.quantity)),
      new Prisma.Decimal(0)
    );

    const order = await tx.order.create({
      data: {
        userId,
        total: total,
        items: {
          create: cart.items.map((item) => ({
            bookId: item.bookId,
            title: item.book.title,
            quantity: item.quantity,
            price: item.book.price,
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