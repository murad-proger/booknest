import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

console.log(
  "STRIPE KEY PREFIX:",
  process.env.STRIPE_SECRET_KEY?.slice(0, 12)
);