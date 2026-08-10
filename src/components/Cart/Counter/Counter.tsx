import styles from "./Counter.module.css"

export default function Counter() {
  return (
    <div className={styles.counter}>
      <button type="button" aria-label="Decrease quantity">
        -
      </button>

      <input
        type="number"
        min={1}
        aria-label="Quantity"
      />

      <button type="button" aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}