import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  const orderId = checkoutSession.metadata?.orderId;

  if (!orderId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    select: { id: true, status: true, userId: true },
  });

  if (!order || String(order.userId) !== String(session.user.id)) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}