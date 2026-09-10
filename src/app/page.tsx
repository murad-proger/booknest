import Hero from "@/components/Home/Hero/Hero";
import styles from "./page.module.css";
import Benefits from "@/components/Home/Benefits/Benefits";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <Benefits />
      </main>
    </div>
  );
}