"use client"

import styles from "./register.module.css"

import { register, type RegisterState } from "@/actions/auth";
import { useActionState } from "react";

export default function RegisterPage() {
  const initialState: RegisterState = {errors: {}}

  const [state, action, isPending] = useActionState(register, initialState)

  return (
    <>
      <h1>Registration page</h1>

      <form className={styles.form} action={action}>
        <label className={styles.field}>
          <span>name:</span>
          <input type="text" name="name" placeholder=" " />
          {state.errors.name && <p className="fieldError">{state.errors.name[0]}</p>}
        </label>

        <label className={styles.field}>
          <span>email:</span>
          <input type="text" name="email" placeholder=" " />
          {state.errors.email && <p className="fieldError">{state.errors.email[0]}</p>}
        </label>

        <label className={styles.field}>
          <span>password:</span>
          <input type="password" name="password" placeholder=" " />
          {state.errors.password && <p className="fieldError">{state.errors.password[0]}</p>}
        </label>

        <button className={styles.button} disabled={isPending}>
          {isPending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </>
  )
}