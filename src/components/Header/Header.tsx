import styles from "./Header.module.css"

import Link from "next/link";
import HeaderCart from "../Cart/HeaderCart/HeaderCart";
import HeaderAuth from "./HeaderAuth/HeaderAuth";

export default async function Header() {

  return (
    <header className={styles.header}>
      <Link href={"/"}>Booknest</Link>
      <nav className={styles.nav}>
        <Link href={"/admin"}>Admin</Link>
        <Link href={"/books"}>Books</Link>
      </nav>
      <div className={styles.leftPanel}>
        <HeaderCart />
        <HeaderAuth />
      </div>
    </header>
  );
}
