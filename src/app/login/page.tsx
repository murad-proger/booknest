"use client";

import styles from "@/styles/authForm.module.css";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { login, type LoginState } from "@/actions/auth";
import Button from "@/components/ui/Button/Button";

export default function LoginPage() {
  const initialState: LoginState = {
    errors: {},
  };

  const [state, action, isPending] = useActionState(
    login,
    initialState
  );

  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    if (!state.success) return;

    const updateSession = async () => {
      await update();
      router.push("/");
    };

    updateSession();
  }, [state.success, update, router]);

  return (
    <>
      <h1>Login page</h1>

      <form className={styles.form} action={action}>
        <label className={styles.field}>
          <span>email:</span>

          <input
            type="text"
            name="email"
            placeholder=" "
          />

          {state.errors.email && (
            <p className="fieldError">
              {state.errors.email[0]}
            </p>
          )}
        </label>

        <label className={styles.field}>
          <span>password:</span>

          <input
            type="password"
            name="password"
            placeholder=" "
          />

          {state.errors.password && (
            <p className="fieldError">
              {state.errors.password[0]}
            </p>
          )}
        </label>

        <Button
          className={styles.button}
        >
          {isPending ? "please wait..." : "login"}
        </Button>
      </form>
    </>
  );
}