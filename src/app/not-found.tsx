import styles from "./not-found.module.css";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

export default function NotFound() {
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

          <text
            x="130"
            y="120"
            textAnchor="middle"
            fontSize="110"
            fontWeight="700"
            fontFamily="var(--font-content), Georgia, serif"
            fill="var(--color-surface)"
            stroke="var(--color-disabled)"
            strokeWidth="1.5"
          >
            404
          </text>

          <g transform="translate(65 90)">
            <path
              d="M65 6C55 0 35 -4 18 -2C14 -1.5 11 1 11 5V78C11 82 14.5 84.5 18 84C35 82 55 86 65 92"
              fill="var(--color-surface)"
              stroke="var(--color-accent-strong)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M65 6C75 0 95 -4 112 -2C116 -1.5 119 1 119 5V78C119 82 115.5 84.5 112 84C95 82 75 86 65 92"
              fill="var(--color-surface)"
              stroke="var(--color-accent-strong)"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M65 6V92"
              stroke="var(--color-disabled)"
              strokeWidth="2"
            />
            <text
              x="65"
              y="58"
              textAnchor="middle"
              fontSize="46"
              fontWeight="700"
              fontFamily="var(--font-content), Georgia, serif"
              fill="var(--color-accent-strong)"
            >
              ?
            </text>
          </g>

          <rect
            x="108"
            y="82"
            width="10"
            height="34"
            rx="2"
            fill="var(--color-danger)"
            transform="rotate(-4 113 82)"
          />
        </svg>

        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          This page doesn&apos;t exist, or it&apos;s been moved.
        </p>

        <div className={styles.actions}>
          <LinkButton href="/" variant="primary">
            Back to home
          </LinkButton>
          <LinkButton href="/books" variant="secondary">
            Browse books
          </LinkButton>
        </div>
      </main>
    </div>
  );
}