import styles from "./Header.module.css"

import Link from "next/link";
import HeaderCart from "../Cart/HeaderCart/HeaderCart";
import { auth } from "@/lib/auth";
import LogoutButton from "../LogoutButton/LogoutButton";

export default async function Header() {
  const session = await auth()

  return (
    <header className={styles.header}>
      <Link href={"/"}>Booknest</Link>
      <nav className={styles.nav}>
        <Link href={"/admin"}>Admin</Link>
        <Link href={"/books"}>Books</Link>
      </nav>
      <div className={styles.leftPanel}>
        <HeaderCart />
        {
          session?.user
           ? (<><span>{session.user.name}</span> <LogoutButton /></>)
           : (
            <>
              <Link href="/login" className={styles.login}>Login</Link>
              <Link href="/register" className={styles.register}>Register</Link>
            </>
           )
        }
      </div>
    </header>
  );
}
