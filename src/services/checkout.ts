import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { createOrderFromCart } from "@/services/orders";

export async function createCheckoutSession() {
  const order = await createOrderFromCart();

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "STRIPE",
      amount: order.total,
      currency: "azn",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    metadata: {
      orderId: order.id.toString(),
    },

    line_items: order.items.map((item) => ({
      price_data: {
        currency: "azn",
        product_data: {
          name: item.title,
        },
        unit_amount: item.price.mul(100).toNumber(),
      },
      quantity: item.quantity,
    })),

    success_url: "http://localhost:3000/checkout/success",
    cancel_url: "http://localhost:3000/checkout/cancel",
  });

  console.log('Session: ', session);

  return {
    session,
  };
}