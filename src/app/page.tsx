import styles from "./page.module.css";

import Hero from "@/components/Home/Hero/Hero";
import Benefits from "@/components/Home/Benefits/Benefits";
import NewArrivals from "@/components/Home/NewArrivals/NewArrivals";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Hero />
        <Benefits />
        <NewArrivals />
      </main>
    </div>
  );
}