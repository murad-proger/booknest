import LinkButton from "@/components/ui/LinkButton/LinkButton";
import styles from "./EmptyOrders.module.css";

export default function EmptyOrders() {
  return (
    <div className={styles.emptyOrders}>
      <svg
        viewBox="0 0 200 160"
        className={styles.illustration}
        aria-hidden="true"
      >
        <circle cx="32" cy="34" r="2.5" className={styles.sparkle} />
        <circle cx="166" cy="46" r="2" className={styles.sparkle} />
        <circle cx="150" cy="18" r="2" className={styles.sparkle} />

        <rect x="60" y="18" width="40" height="10" rx="2" className={styles.tab} />

        <path
          d="M60,28 H140 V128 L131,121 L122,128 L113,121 L104,128 L95,121 L86,128 L77,121 L68,128 L60,121 Z"
          className={styles.receipt}
        />

        <line x1="74" y1="48" x2="126" y2="48" className={styles.line} />
        <line x1="74" y1="62" x2="126" y2="62" className={styles.line} />
        <line x1="74" y1="76" x2="108" y2="76" className={styles.line} />
      </svg>

      <p className={styles.title}>No orders yet</p>
      <p className={styles.subtitle}>
        Your past orders will show up here once you make a purchase.
      </p>

      <LinkButton href="/books">Browse books</LinkButton>
    </div>
  );
}
