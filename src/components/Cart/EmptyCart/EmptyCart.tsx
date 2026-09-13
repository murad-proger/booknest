import LinkButton from "@/components/ui/LinkButton/LinkButton";
import styles from "./EmptyCart.module.css";

export default function EmptyCart() {
  return (
    <div className={styles.emptyCart}>
      <svg
        viewBox="0 0 200 160"
        className={styles.illustration}
        aria-hidden="true"
      >
        <circle cx="34" cy="40" r="3" className={styles.sparkle} />
        <circle cx="168" cy="55" r="2.5" className={styles.sparkle} />
        <circle cx="150" cy="22" r="2" className={styles.sparkle} />
        <circle cx="26" cy="92" r="2" className={styles.sparkle} />

        <path d="M72,72 C72,38 128,38 128,72" className={styles.handle} />

        <path
          d="M50,72 L150,72 L138,140 C137,146 132,150 126,150 L74,150 C68,150 63,146 62,140 Z"
          className={styles.basket}
        />

        <rect x="46" y="64" width="108" height="14" rx="7" className={styles.rim} />

        <line x1="66" y1="90" x2="134" y2="90" className={styles.weave} />
        <line x1="70" y1="112" x2="130" y2="112" className={styles.weave} />
        <line x1="74" y1="134" x2="126" y2="134" className={styles.weave} />

        <g transform="rotate(-12 100 55)">
          <rect x="80" y="38" width="40" height="30" rx="2" className={styles.bookCover} />
          <rect x="118" y="40" width="4" height="26" className={styles.bookPages} />
          <line x1="86" y1="46" x2="112" y2="46" className={styles.bookLine} />
          <line x1="86" y1="54" x2="112" y2="54" className={styles.bookLine} />
          <line x1="86" y1="62" x2="104" y2="62" className={styles.bookLine} />
        </g>
      </svg>

      <p className={styles.title}>Your cart is empty</p>
      <p className={styles.subtitle}>
        Looks like you haven&apos;t added any books yet.
      </p>

      <LinkButton href="/books">Browse books</LinkButton>
    </div>
  );
}
