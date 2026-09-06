import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { refundPayment } from "@/services/checkout";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId: orderIdParam } = await params;
  const orderId = Number(orderIdParam);

  try {
    const { refund } = await refundPayment(orderId);

    return NextResponse.json({ refundId: refund.id, status: refund.status });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message === "NOT_REFUNDABLE") {
      return NextResponse.json(
        { error: "Order has no refundable payment" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Refund failed" }, { status: 500 });
  }
}