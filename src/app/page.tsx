import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Booknest</h1>
        <p>main page</p>
      </main>
    </div>
  );
}
