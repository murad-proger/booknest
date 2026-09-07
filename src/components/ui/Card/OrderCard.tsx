import Card from "./Card";
import Badge from "@/components/ui/Badge/Badge";
import styles from "./OrderCard.module.css";
import { ReactNode } from "react";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/enums";

type Status = OrderStatus | PaymentStatus;

interface OrderCardItem {
  id: number;
  title: string;
  quantity: number;
}

interface OrderCardProps {
  variant: "storefront" | "admin";
  orderId: number;
  status: Status;
  total: string;
  items: OrderCardItem[];
  userEmail?: string;
  action?: ReactNode;
}

export default function OrderCard({
  variant,
  orderId,
  status,
  total,
  items,
  userEmail,
  action,
}: OrderCardProps) {
  return (
    <Card variant={variant} className={styles.orderCard}>
      <div className={styles.header}>
        <p className={styles.meta}>
          Order #{orderId}
          {userEmail && <span className={styles.email}> — {userEmail}</span>}
        </p>
        <Badge status={status} />
      </div>

      <p className={styles.total}>${total}</p>

      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.id}>
            {item.title} × {item.quantity}
          </li>
        ))}
      </ul>

      {action && <div className={styles.action}>{action}</div>}
    </Card>
  );
}