import styles from "./LogoutButton.module.css"

import { signOut } from "@/lib/auth"

export default function LogoutButton() {
  return (
    <form action={async () => {
      "use server"

      await signOut()
    }}>
      <button className={styles.logout}>Logout</button>
    </form>
  )
}