"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import styles from "./HeaderAuth.module.css";
import LogoutButton from "@/components/LogoutButton/LogoutButton";

export default function HeaderAuth() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <>
        <span>{session.user.name}</span>
        <LogoutButton />
      </>
    );
  }

  return (
    <>
      <Link href="/login" className={styles.login}>
        Login
      </Link>

      <Link href="/register" className={styles.register}>
        Register
      </Link>
    </>
  );
}