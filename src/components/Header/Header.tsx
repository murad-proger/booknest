"use client"

import styles from "./Header.module.css"

import Link from "next/link";
import HeaderCart from "../Cart/HeaderCart/HeaderCart";
import HeaderAuth from "./HeaderAuth/HeaderAuth";
import { useSession } from "next-auth/react";

export default function Header() {
  const session = useSession()

  return (
    <header className={styles.header}>
      <Link href={"/"}>Booknest</Link>
      <nav className={styles.nav}>
        <Link href={"/books"}>Books</Link>
        {session?.data?.user.role === "ADMIN" && (<Link href={"/admin"}>Admin</Link>)}
      </nav>
      <div className={styles.leftPanel}>
        <HeaderCart />
        <HeaderAuth />
      </div>
    </header>
  );
}
