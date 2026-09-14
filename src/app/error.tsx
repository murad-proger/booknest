"use client";

import { useEffect } from "react";
import styles from "./error.module.css";
import LinkButton from "@/components/ui/LinkButton/LinkButton";
import Button from "@/components/ui/Button/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <svg
          className={styles.illustration}
          width="260"
          height="220"
          viewBox="0 0 260 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <ellipse cx="130" cy="188" rx="90" ry="14" fill="var(--color-shadow)" />

          <g transform="translate(65 40)">
            <path
              d="M65 6C55 0 35 -4 18 -2C14 -1.5 11 1 11 5V78C11 82 14.5 84.5 18 84C35 82 55 86 65 92"
              fill="var(--color-surface)"
              stroke="var(--color-danger)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M65 6C75 0 95 -4 112 -2C116 -1.5 119 1 119 5V78C119 82 115.5 84.5 112 84C95 82 75 86 65 92"
              fill="var(--color-surface)"
              stroke="var(--color-danger)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path d="M65 6V92" stroke="var(--color-disabled)" strokeWidth="2" />
            <text
              x="65"
              y="58"
              textAnchor="middle"
              fontSize="46"
              fontWeight="700"
              fontFamily="var(--font-content), Georgia, serif"
              fill="var(--color-danger)"
            >
              !
            </text>
          </g>

          <rect
            x="108"
            y="32"
            width="10"
            height="34"
            rx="2"
            fill="var(--color-accent-strong)"
            transform="rotate(-4 113 32)"
          />
        </svg>

        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.subtitle}>
          An unexpected error occurred while rendering this page. You can try
          again, or head back to a safe place.
        </p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={() => reset()}>
            Try again
          </Button>
          <LinkButton href="/" variant="secondary">
            Back to home
          </LinkButton>
        </div>
      </main>
    </div>
  );
}
