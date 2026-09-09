"use client";

import styles from "./MobileNav.module.css";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import NavLink from "../NavLink/NavLink";

export default function MobileNav({ role }: { role?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={styles.trigger} aria-label="Open menu">
          <BurgerIcon />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-describedby={undefined}>
          <div className={styles.contentHeader}>
            <Dialog.Title className={styles.title}>Menu</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.close} aria-label="Close menu">
                <CloseIcon />
              </button>
            </Dialog.Close>
          </div>

          <nav className={styles.nav} onClick={() => setOpen(false)}>
            <NavLink href={"/"}>Main</NavLink>
            <NavLink href={"/books"}>Books</NavLink>
            {role === "ADMIN" && <NavLink href={"/admin"}>Admin</NavLink>}
            {role === "USER" && <NavLink href={"/orders"}>Orders</NavLink>}
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function BurgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}