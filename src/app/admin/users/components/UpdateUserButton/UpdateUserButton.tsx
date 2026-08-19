"use client"

import styles from "./UpdateUserButton.module.css"

import { deleteUserAction } from "@/actions/users"

export default function UpdateUserButton({ id }: { id: number }) {
  const handleDelete = async (id: number) => {
    const confirmed = confirm("Are you sure you that want to delete this user?")

    if(!confirmed) return false

    const result = await deleteUserAction(id)

    if (!result.success) {
      return alert(result.error)
    }
  }

  return (
    <button
      className={styles.deleteButton}
      onClick={() => {handleDelete(id)}}
    >
      Update
    </button>
  )
}