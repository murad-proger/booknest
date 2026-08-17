import styles from "./Header.module.css"

import Link from "next/link";
import HeaderCart from "../Cart/HeaderCart/HeaderCart";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href={"/"}>Booknest</Link>
      <nav className={styles.nav}>
        <Link href={"/admin"}>Admin</Link>
        <Link href={"/books"}>Books</Link>
      </nav>
      <div className={styles.leftPanel}>
        <HeaderCart />
        <Link href="/login" className={styles.login}>Login</Link>
        <Link href="/register" className={styles.register}>Register</Link>
      </div>
    </header>
  );
}
