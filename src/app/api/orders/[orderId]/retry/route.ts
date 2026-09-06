import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createRetryCheckoutSession } from "@/services/checkout";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId: orderIdParam } = await params;
  const orderId = Number(orderIdParam);

  try {
    const { session: checkoutSession } = await createRetryCheckoutSession(
      orderId,
      Number(session.user.id)
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message === "NOT_RETRYABLE") {
      return NextResponse.json(
        { error: "Order is not retryable" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Retry failed" }, { status: 500 });
  }
}