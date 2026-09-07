import { getOrdersForUser } from "@/services/orders";
import RetryPaymentButton from "@/components/Orders/RetryPaymentButton/RetryPaymentButton";

export default async function OrdersPage() {
  const orders = await getOrdersForUser();

  return (
    <main>
      <h1>My orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id}>
            <p>Order #{order.id} — {order.status} — ${order.total.toString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.title} × {item.quantity}
                </li>
              ))}
            </ul>
            {order.status === "PENDING" && <RetryPaymentButton orderId={order.id} />}
          </div>
        ))
      )}
    </main>
  );
}