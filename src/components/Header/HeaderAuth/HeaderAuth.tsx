"use client";

import { useSession } from "next-auth/react";

import LogoutButton from "@/components/LogoutButton/LogoutButton";
import LinkButton from "@/components/ui/LinkButton/LinkButton";

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
      <LinkButton variant="secondary" href="/login">
        Login
      </LinkButton>

      <LinkButton variant="primary" href="/register">
        Register
      </LinkButton>
    </>
  );
}