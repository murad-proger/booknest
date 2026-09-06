import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/services/checkout";

export async function POST() {
  try {
    const session = await createCheckoutSession();

    return NextResponse.json(session);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.error(error);

    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}