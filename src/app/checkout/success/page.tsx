"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../checkoutStatus.module.css";
import Card from "@/components/ui/Card/Card";

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
      <main className={styles.wrapper}>
        <Card variant="storefront">
          <h1 className={styles.success}>Payment successful</h1>
          <p>Thank you for your purchase.</p>
        </Card>
      </main>
    );
  }

  if (status === "PENDING") {
    return (
      <main className={styles.wrapper}>
        <Card variant="storefront">
          <h1 className={styles.pending}>Confirming your payment...</h1>
          <p>This usually takes just a few seconds.</p>
        </Card>
      </main>
    );
  }

  return (
    <main className={styles.wrapper}>
      <Card variant="storefront">
        <h1 className={styles.error}>Something went wrong</h1>
        <p>We couldn&apos;t confirm your payment. Please contact support.</p>
      </Card>
    </main>
  );
}