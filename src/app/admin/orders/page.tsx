import { getAllOrders } from "@/services/orders";
import RefundButton from "./components/RefundButton/RefundButton";
import OrderCard from "@/components/ui/Card/OrderCard";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            variant="admin"
            orderId={order.id}
            status={order.status}
            total={order.total.toString()}
            items={order.items}
            userEmail={order.user.email}
            action={
              order.status === "PAID" && <RefundButton orderId={order.id} />
            }
          />
        ))
      )}
    </>
  );
}