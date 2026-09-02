"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "PENDING" | "PAID" | "CANCELLED" | "ERROR";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("PENDING");

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      if (!sessionId) {
        if (!cancelled) setStatus("ERROR");
        return;
      }

      try {
        const res = await fetch(
          `/api/checkout/status?session_id=${sessionId}`
        );

        if (!res.ok) {
          if (!cancelled) setStatus("ERROR");
          return;
        }

        const data = await res.json();

        if (cancelled) return;

        setStatus(data.status);

        if (data.status === "PENDING") {
          setTimeout(checkStatus, 2000);
        }
      } catch {
        if (!cancelled) setStatus("ERROR");
      }
    }

    checkStatus();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "PAID") {
    return (
      <main>
        <h1>Payment successful</h1>
        <p>Thank you for your purchase.</p>
      </main>
    );
  }

  if (status === "PENDING") {
    return (
      <main>
        <h1>Confirming your payment...</h1>
        <p>This usually takes just a few seconds.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>We couldn&apos;t confirm your payment. Please contact support.</p>
    </main>
  );
}