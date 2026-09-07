import { getAllOrders } from "@/services/orders";
import RefundButton from "./components/RefundButton/RefundButton";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <>
      <h1>Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <p>
              Order #{order.id} — {order.user.email} — {order.status} — $
              {order.total.toString()}
            </p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>
            {order.status === "PAID" && <RefundButton orderId={order.id} />}
          </div>
        ))
      )}
    </>
  );
}