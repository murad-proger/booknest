import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createOrderFromCart } from "@/services/orders";

export async function createCheckoutSession() {
  const order = await createOrderFromCart();

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "STRIPE",
      amount: order.total,
      currency: "azn",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { orderId: order.id.toString() },
    payment_intent_data: {
      metadata: { orderId: order.id.toString() },
    },
    line_items: buildLineItems(order.items),
    success_url: "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/checkout/cancel",
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { checkoutSessionId: session.id },
  });

  console.log("Session: ", session);

  return { session };
}

function buildLineItems(items: { title: string; price: Prisma.Decimal; quantity: number }[]) {
  return items.map((item) => ({
    price_data: {
      currency: "azn",
      product_data: { name: item.title },
      unit_amount: item.price.mul(100).toNumber(),
    },
    quantity: item.quantity,
  }));
}

export async function createRetryCheckoutSession(orderId: number, userId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payments: true },
  });

  if (!order || String(order.userId) !== String(userId)) {
    throw new Error("NOT_FOUND");
  }

  if (order.status !== "PENDING") {
    throw new Error("NOT_RETRYABLE");
  }

  const pendingPayment = order.payments.find((p) => p.status === "PENDING");

  if (pendingPayment?.checkoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      pendingPayment.checkoutSessionId
    );

    if (existingSession.status === "open") {
      return { session: existingSession };
    }

    await prisma.payment.update({
      where: { id: pendingPayment.id },
      data: { status: "FAILED" },
    });
  }

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "STRIPE",
      amount: order.total,
      currency: "azn",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { orderId: order.id.toString() },
    payment_intent_data: {
      metadata: { orderId: order.id.toString() },
    },
    line_items: buildLineItems(order.items),
    success_url: "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/checkout/cancel",
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { checkoutSessionId: session.id },
  });

  return { session };
}

export async function refundPayment(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payments: true },
  });

  if (!order) {
    throw new Error("NOT_FOUND");
  }

  const succeededPayment = order.payments.find((p) => p.status === "SUCCEEDED");

  if (!succeededPayment || !succeededPayment.providerPaymentId) {
    throw new Error("NOT_REFUNDABLE");
  }

  const refund = await stripe.refunds.create({
    payment_intent: succeededPayment.providerPaymentId,
  });

  return { refund };
}