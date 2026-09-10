import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.overlay}>
      <div className={styles.glow} />

      <div className={styles.scene}>
        <div className={styles.book}>
          <div className={styles.spine} />
          <div className={styles.coverLeft} />
          <div className={styles.coverRight} />

          <div className={styles.flipper}>
            <div className={styles.faceFront} />
            <div className={styles.faceBack} />
          </div>
        </div>
      </div>

      <p className={styles.label}>
        Loading<span className={styles.dots} aria-hidden="true" />
      </p>
    </div>
  );
}
