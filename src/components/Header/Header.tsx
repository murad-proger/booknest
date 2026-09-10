"use client";

import styles from "./Header.module.css";

import HeaderCart from "../Cart/HeaderCart/HeaderCart";
import HeaderAuth from "./HeaderAuth/HeaderAuth";
import MobileNav from "./MobileNav/MobileNav";
import { useSession } from "next-auth/react";
import NavLink from "./NavLink/NavLink";
import Logo from "./Logo/Logo";
import ThemeToggle from "./ThemeToggle/ThemeToggle";

export default function Header() {
  const session = useSession();

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.headerInner}>
          <Logo />

          <nav className={styles.nav}>
            <NavLink href={"/"}>Main</NavLink>
            <NavLink href={"/books"}>Books</NavLink>
            {session?.data?.user.role === "ADMIN" && (
              <NavLink href={"/admin"}>Admin</NavLink>
            )}
            {session?.data?.user.role === "USER" && (
              <NavLink href={"/orders"}>Orders</NavLink>
            )}
          </nav>

          <div className={styles.leftPanel}>
            <HeaderCart />
            <HeaderAuth />
            <ThemeToggle />
            <MobileNav role={session?.data?.user.role} />
          </div>
        </div>
      </div>
    </header>
  );
}