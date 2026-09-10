import Link from "next/link";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href={"/"} className={styles.logo} aria-label="BookNest — на главную">
      <svg
        className={styles.icon}
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 6.5C12.1 5.1 9.4 4.5 6.5 4.5C5.4 4.5 4.3 4.6 3.3 4.8C2.8 4.9 2.5 5.3 2.5 5.8V20.3C2.5 20.9 3.1 21.4 3.7 21.3C4.6 21.1 5.5 21 6.5 21C9.2 21 11.8 21.6 14 22.9"
          stroke="var(--color-accent-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 6.5C15.9 5.1 18.6 4.5 21.5 4.5C22.6 4.5 23.7 4.6 24.7 4.8C25.2 4.9 25.5 5.3 25.5 5.8V20.3C25.5 20.9 24.9 21.4 24.3 21.3C23.4 21.1 22.5 21 21.5 21C18.8 21 16.2 21.6 14 22.9"
          stroke="var(--color-accent-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 6.5V22.9"
          stroke="var(--color-accent-strong)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.name}>BookNest</span>
    </Link>
  );
}
