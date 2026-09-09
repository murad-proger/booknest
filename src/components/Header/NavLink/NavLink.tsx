"use client";

import styles from "./NavLink.module.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export default function NavLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const hrefStr = href.toString();
  const isActive = pathname === hrefStr || pathname.startsWith(`${hrefStr}/`);

  return (
    <Link
      href={href}
      className={isActive ? `${styles.link} ${styles.active}` : styles.link}
      aria-current={isActive ? "page" : undefined}
      {...rest}
    />
  );
}