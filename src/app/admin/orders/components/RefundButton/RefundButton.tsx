"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefundButton({ orderId }: { orderId: number }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRefund = async () => {
    const confirmed = confirm("Refund this order?");

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Refund failed");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Refund error:", error);
      alert("Refund failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleRefund} disabled={isLoading}>
      {isLoading ? "Processing..." : "Refund"}
    </button>
  );
}