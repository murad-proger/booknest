import styles from "./Badge.module.css";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

type Status = OrderStatus | PaymentStatus;

const STATUS_VARIANT: Record<Status, "accent" | "success" | "danger" | "disabled"> = {
  PENDING: "accent",
  PAID: "success",
  SUCCEEDED: "success",
  FAILED: "danger",
  CANCELLED: "danger",
  REFUNDED: "disabled",
  REFUND_PENDING: "accent",
};

export default function Badge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${styles[STATUS_VARIANT[status]]}`}>
      {status}
    </span>
  );
}