import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId: orderIdParam } = await params;
  const orderId = Number(orderIdParam);

  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order || String(order.userId) !== String(session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json(
      { error: "Order is not retryable" },
      { status: 409 }
    );
  }

  return NextResponse.json({ ok: true, orderId: order.id });
}