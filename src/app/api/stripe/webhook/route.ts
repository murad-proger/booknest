import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { clearCartByUserId } from "@/services/cart";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature", {
      status: 400,
    });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;

  const orderId = session.metadata?.orderId;
  const paymentIntentId = session.payment_intent;

  if (!orderId || !paymentIntentId) {
    return new NextResponse("Missing payment data", {
      status: 400,
    });
  }

  const order = await prisma.order.findUnique({
    where: {
      id: Number(orderId),
    },
    select: {
      userId: true,
    },
  });

  if (!order) {
    return new NextResponse("Order not found", {
      status: 404,
    });
  }

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findFirst({
      where: {
        orderId: Number(orderId),
        provider: "STRIPE",
        status: "PENDING",
      },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        providerPaymentId: paymentIntentId as string,
        status: "SUCCEEDED",
      },
    });

    await tx.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        status: "PAID",
      },
    });

    await clearCartByUserId(order.userId, tx);
  });

  console.log("Payment, Order and Cart updated:", {
    orderId,
    paymentIntentId,
    userId: order.userId,
  });
}

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);

    return new NextResponse("Webhook Error", {
      status: 400,
    });
  }
}