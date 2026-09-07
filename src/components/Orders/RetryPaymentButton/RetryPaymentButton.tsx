"use client";

import { useState } from "react";

export default function RetryPaymentButton({ orderId }: { orderId: number }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRetry = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/orders/${orderId}/retry`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Retry failed");
      }

      const data = await response.json();

      window.location.href = data.url;
    } catch (error) {
      console.error("Retry error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleRetry} disabled={isLoading}>
      {isLoading ? "Processing..." : "Retry payment"}
    </button>
  );
}