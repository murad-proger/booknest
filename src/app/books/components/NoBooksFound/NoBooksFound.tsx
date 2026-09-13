import LinkButton from "@/components/ui/LinkButton/LinkButton";
import styles from "./NoBooksFound.module.css";

export default function NoBooksFound() {
  return (
    <div className={styles.noBooksFound}>
      <svg
        viewBox="0 0 200 160"
        className={styles.illustration}
        aria-hidden="true"
      >
        <rect x="55" y="118" width="90" height="14" rx="3" className={styles.stackBottom} />
        <rect x="62" y="104" width="76" height="14" rx="3" className={styles.stackTop} />

        <g transform="translate(50 46)">
          <path
            d="M40,8 C30,2 12,-1 2,1 C1,1 0,2 0,3 V70 C0,71 1,72 2,72 C12,70 30,73 40,79"
            className={styles.pageLeft}
          />
          <path
            d="M40,8 C50,2 68,-1 78,1 C79,1 80,2 80,3 V70 C80,71 79,72 78,72 C68,70 50,73 40,79"
            className={styles.pageRight}
          />
          <path d="M40,8 V79" className={styles.spine} />
        </g>

        <g transform="translate(120 34)">
          <circle cx="0" cy="0" r="23" className={styles.lens} />
          <line x1="16" y1="16" x2="33" y2="33" className={styles.handle} />
        </g>
      </svg>

      <p className={styles.title}>No books found</p>
      <p className={styles.subtitle}>
        Try adjusting your search or filters.
      </p>

      <LinkButton href="/books" variant="secondary">
        Clear filters
      </LinkButton>
    </div>
  );
}
