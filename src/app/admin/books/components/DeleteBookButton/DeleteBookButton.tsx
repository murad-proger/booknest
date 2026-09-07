"use client"

import Button from "@/components/ui/Button/Button"
import { deleteBookAction } from "@/actions/books"

export default function DeleteBookButton({ id }: { id: number }) {
  const handleDelete = async () => {
    const confirmed = confirm('Are you sure that you want to delete this book')

    if (!confirmed) return

    const result = await deleteBookAction(id)

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