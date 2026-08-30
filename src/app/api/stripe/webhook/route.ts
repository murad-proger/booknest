import { NextResponse } from "next/server";
import Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

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

      const payment = await prisma.payment.findFirst({
        where: {
          orderId: Number(orderId),
          provider: "STRIPE",
          status: "PENDING",
        },
      });

      if (!payment) {
        return new NextResponse("Payment not found", {
          status: 404,
        });
      }

      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          providerPaymentId: paymentIntentId as string,
          status: "SUCCEEDED",
        },
      });

      console.log("Payment updated:", {
        paymentId: payment.id,
        orderId,
        paymentIntentId,
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