"use client"

import Button from "@/components/ui/Button/Button"
import { deleteUserAction } from "@/actions/users"

export default function DeleteUserButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you that want to delete this user?")

    if (!confirmed) return

    const result = await deleteUserAction(id)

    if (!result.success) {
      return alert(result.error)
    }
  }

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  )
}