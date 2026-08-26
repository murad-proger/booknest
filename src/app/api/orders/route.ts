import { NextResponse } from "next/server";
import { createOrderFromCart } from "@/services/orders";

export async function POST() {
  try {
    const order = await createOrderFromCart();

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      if (error.message === "Cart is empty") {
        return NextResponse.json(
          { error: "Cart is empty" },
          { status: 400 }
        );
      }
    }

    console.error("Create order error:", error);

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}