import { getOrdersForUser } from "@/services/orders";
import RetryPaymentButton from "@/components/Orders/RetryPaymentButton/RetryPaymentButton";
import OrderCard from "@/components/ui/Card/OrderCard";

export default async function OrdersPage() {
  const orders = await getOrdersForUser();

  return (
    <main>
      <h1>My orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            variant="storefront"
            orderId={order.id}
            status={order.status}
            total={order.total.toString()}
            items={order.items}
            action={
              order.status === "PENDING" && (
                <RetryPaymentButton orderId={order.id} />
              )
            }
          />
        ))
      )}
    </main>
  );
}