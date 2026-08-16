"use client"

import styles from "./login.module.css"

import  { login, type LoginState } from "@/actions/auth"
import { useActionState } from "react"

export default function LoginPage() {
  const initialState: LoginState = {errors: {}}
  
  const [state, action, isPending] = useActionState(login, initialState)

  return (
    <>
      <h1>Login page</h1>

      <form className={styles.form} action={action}>
        <label className={styles.field}>
          <span>email:</span>
          <input type="text" name="email" />
          {state?.errors.email && <p className="fieldError">{state.errors.email[0]}</p>}
        </label>

        <label className={styles.field}>
          <span>password:</span>
          <input type="password" name="password" />
          {state?.errors.password && <p className="fieldError">{state.errors.password[0]}</p>}
        </label>

        <button className={styles.button} disabled={isPending}>
          {isPending ? 'please wait...' : 'login'}
        </button>
      </form>
    </>
  )
}