"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";

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
    <Button variant="primary" onClick={handleRetry} disabled={isLoading}>
      {isLoading ? "Processing..." : "Retry payment"}
    </Button>
  );
}