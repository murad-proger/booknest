import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/services/checkout";

export async function POST() {
  try {
    const session = await createCheckoutSession();

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}