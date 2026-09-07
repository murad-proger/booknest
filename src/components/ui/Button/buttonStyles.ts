import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger";

export function buttonClassName(variant: ButtonVariant = "primary", className?: string) {
  return `${styles.button} ${styles[variant]} ${className ?? ""}`.trim();
}