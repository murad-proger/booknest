import styles from "./Card.module.css";
import { ReactNode } from "react";

type CardVariant = "storefront" | "admin";

interface CardProps {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
}

export default function Card({ variant = "storefront", children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className ?? ""}`}>
      {children}
    </div>
  );
}