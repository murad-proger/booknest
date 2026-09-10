import styles from "./Hero.module.css";

import LinkButton from "@/components/ui/LinkButton/LinkButton";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.text}>
        <span className={styles.eyebrow}>Welcome to BookNest</span>
        <h1 className={styles.title}>Books worth staying up for.</h1>
        <p className={styles.subtitle}>
          A small, curated shelf of titles worth clearing your evening for.
          Browse the catalog and find your next read.
        </p>

        <div className={styles.actions}>
          <LinkButton href="/books" variant="primary">
            Browse books
          </LinkButton>
          <LinkButton href="/register" variant="secondary">
            Create an account
          </LinkButton>
        </div>
      </div>

      <svg
        className={styles.illustration}
        width="320"
        height="260"
        viewBox="0 0 320 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="160" cy="234" rx="120" ry="16" fill="var(--color-shadow)" />

        <rect
          x="50"
          y="188"
          width="220"
          height="26"
          rx="5"
          fill="color-mix(in srgb, var(--color-accent) 55%, var(--color-surface))"
          stroke="var(--color-disabled)"
          transform="rotate(-2 160 201)"
        />
        <rect
          x="65"
          y="164"
          width="190"
          height="26"
          rx="5"
          fill="var(--color-surface)"
          stroke="var(--color-disabled)"
          transform="rotate(1.5 160 177)"
        />

        <g transform="translate(85 40)">
          <path
            d="M75 8C63 1 39 -4 19 -2C14.5 -1.5 11 1.5 11 6V96C11 100.5 15 103.5 19.5 103C39 100.5 63 105 75 112"
            fill="var(--color-surface)"
            stroke="var(--color-accent-strong)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M75 8C87 1 111 -4 131 -2C135.5 -1.5 139 1.5 139 6V96C139 100.5 135 103.5 130.5 103C111 100.5 87 105 75 112"
            fill="var(--color-surface)"
            stroke="var(--color-accent-strong)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M75 8V112" stroke="var(--color-disabled)" strokeWidth="2" />

          <path
            d="M28 22C38 19 52 20 61 25"
            stroke="var(--color-disabled)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 38C38 35 52 36 61 41"
            stroke="var(--color-disabled)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 54C36 51.5 46 52.5 53 56"
            stroke="var(--color-disabled)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        <rect
          x="180"
          y="30"
          width="9"
          height="40"
          rx="2"
          fill="var(--color-danger)"
          transform="rotate(6 184 30)"
        />
      </svg>
    </section>
  );
}
