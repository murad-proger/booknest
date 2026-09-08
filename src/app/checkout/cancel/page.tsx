import styles from "../checkoutStatus.module.css";
import Card from "@/components/ui/Card/Card";

export default function CancelPage() {
  return (
    <main className={styles.wrapper}>
      <Card variant="storefront">
        <h1 className={styles.error}>Payment cancelled</h1>
        <p>Your payment was not completed.</p>
      </Card>
    </main>
  );
}