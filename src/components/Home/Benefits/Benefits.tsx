import Card from "@/components/ui/Card/Card";
import styles from "./Benefits.module.css";

const benefits = [
  {
    title: "Curated selection",
    text: "Every title on the shelf is picked, not just piled on.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 7C12.3 5.9 9.9 5.3 7.5 5.3C6.5 5.3 5.6 5.4 4.7 5.6C4.3 5.7 4 6 4 6.4V19.5C4 20 4.5 20.4 5 20.3C5.8 20.1 6.6 20 7.5 20C9.9 20 12.3 20.6 14 21.7"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M14 7C15.7 5.9 18.1 5.3 20.5 5.3C21.5 5.3 22.4 5.4 23.3 5.6C23.7 5.7 24 6 24 6.4V19.5C24 20 23.5 20.4 23 20.3C22.2 20.1 21.4 20 20.5 20C18.1 20 15.7 20.6 14 21.7"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
        <path d="M14 7V21.7" stroke="var(--color-disabled)" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Secure checkout",
    text: "Payments run through Stripe — your card details never touch our servers.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14 4L23 7.5V13C23 18.5 19.3 22.9 14 24C8.7 22.9 5 18.5 5 13V7.5L14 4Z"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinejoin="round"
        />
        <path
          d="M10 14L12.7 16.7L18 11.3"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Easy refunds",
    text: "Changed your mind? Cancel or refund an order right from your order history.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6 13C6 8.6 9.6 5 14 5C17.4 5 20.3 7.1 21.4 10.1"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round"
        />
        <path d="M21.4 5.5V10.1H16.8" stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M22 15C22 19.4 18.4 23 14 23C10.6 23 7.7 20.9 6.6 17.9"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round"
        />
        <path d="M6.6 22.5V17.9H11.2" stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Fast delivery",
    text: "Orders are packed with care and on their way within a day.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4 8H16V19H4V8Z"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinejoin="round"
        />
        <path
          d="M16 12H20.5L24 15.5V19H16V12Z"
          stroke="var(--color-accent-strong)" strokeWidth="1.8" strokeLinejoin="round"
        />
        <circle cx="9" cy="21.5" r="2" stroke="var(--color-disabled)" strokeWidth="1.6" />
        <circle cx="19.5" cy="21.5" r="2" stroke="var(--color-disabled)" strokeWidth="1.6" />
      </svg>
    ),
  },
];

export default function Benefits() {
  return (
    <section className={styles.benefits}>
      {benefits.map((benefit) => (
        <Card key={benefit.title} variant="storefront" className={styles.card}>
          <div className={styles.icon}>{benefit.icon}</div>
          <h3 className={styles.title}>{benefit.title}</h3>
          <p className={styles.text}>{benefit.text}</p>
        </Card>
      ))}
    </section>
  );
}