import { NextResponse } from "next/server";
import Stripe from "stripe";

import { Prisma } from "@/generated/prisma/client";
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
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    const processed = await prisma.$transaction(async (tx) => {
      try {
        await tx.webhookEvent.create({
          data: {
            provider: "STRIPE",
            eventId: event.id,
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          return false;
        }

        throw error;
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        const paymentIntentId = session.payment_intent;

        if (!orderId || !paymentIntentId) {
          throw new Error("Missing payment data");
        }

        const order = await tx.order.findUnique({
          where: {
            id: Number(orderId),
          },
          select: {
            userId: true,
          },
        });

        if (!order) {
          throw new Error("Order not found");
        }

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

        const paymentResult = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: "PENDING",
          },
          data: {
            providerPaymentId: paymentIntentId as string,
            status: "SUCCEEDED",
          },
        });

        if (paymentResult.count === 0) {
          throw new Error("Payment status changed before it could be marked SUCCEEDED");
        }

        const orderResult = await tx.order.updateMany({
          where: {
            id: Number(orderId),
            status: "PENDING",
          },
          data: {
            status: "PAID",
          },
        });

        if (orderResult.count === 0) {
          throw new Error("Order status changed before it could be marked PAID");
        }

        await clearCartByUserId(order.userId, tx);

        console.log("Payment, Order and Cart updated:", {
          orderId,
          paymentIntentId,
          userId: order.userId,
        });
      }

      if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata?.orderId;

        if (!orderId) {
          throw new Error("Missing orderId in payment_intent metadata");
        }

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

        const paymentResult = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: "PENDING",
          },
          data: {
            providerPaymentId: paymentIntent.id,
            status: "FAILED",
          },
        });

        if (paymentResult.count === 0) {
          console.log("Payment was not marked FAILED (status changed):", {
            paymentId: payment.id,
          });
        }

        console.log("Payment marked FAILED:", {
          orderId,
          paymentIntentId: paymentIntent.id,
        });
      }

      if (event.type === "checkout.session.expired") {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          throw new Error("Missing orderId in session metadata");
        }

        const payment = await tx.payment.findFirst({
          where: {
            orderId: Number(orderId),
            provider: "STRIPE",
            status: "PENDING",
          },
        });

        if (payment) {
          const paymentResult = await tx.payment.updateMany({
            where: {
              id: payment.id,
              status: "PENDING",
            },
            data: {
              status: "FAILED",
            },
          });

          if (paymentResult.count === 0) {
            console.log("Payment was not marked FAILED (status changed):", {
              paymentId: payment.id,
            });
          }
        }

        const result = await tx.order.updateMany({
          where: {
            id: Number(orderId),
            status: "PENDING",
          },
          data: {
            status: "CANCELLED",
          },
        });

        if (result.count === 0) {
          console.log("Order was not cancelled:", { orderId });
        } else {
          console.log("Order cancelled after session expiry:", { orderId });
        }
      }

      if (event.type === "charge.refunded") {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent;

        if (!paymentIntentId) {
          throw new Error("Missing payment_intent in charge");
        }

        const payment = await tx.payment.findFirst({
          where: {
            provider: "STRIPE",
            providerPaymentId: paymentIntentId as string,
            status: "SUCCEEDED",
          },
        });

        if (!payment) {
          throw new Error("Payment not found for refund");
        }

        const paymentResult = await tx.payment.updateMany({
          where: {
            id: payment.id,
            status: "SUCCEEDED",
          },
          data: {
            status: "REFUNDED",
          },
        });

        if (paymentResult.count === 0) {
          throw new Error("Payment status changed before it could be marked REFUNDED");
        }

        const orderResult = await tx.order.updateMany({
          where: {
            id: payment.orderId,
            status: "PAID",
          },
          data: {
            status: "REFUNDED",
          },
        });

        if (orderResult.count === 0) {
          throw new Error("Order status changed before it could be marked REFUNDED");
        }

        console.log("Payment and Order marked REFUNDED:", {
          orderId: payment.orderId,
          paymentIntentId,
        });
      }

      if (
        event.type !== "checkout.session.completed" &&
        event.type !== "payment_intent.payment_failed" &&
        event.type !== "checkout.session.expired" &&
        event.type !== "charge.refunded"
      ) {
        console.log("Unhandled Stripe event type:", event.type);
      }

      return true;
    });

    if (!processed) {
      console.log("Duplicate webhook event ignored:", event.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);

    return new NextResponse("Webhook Error", {
      status: 400,
    });
  }
}
