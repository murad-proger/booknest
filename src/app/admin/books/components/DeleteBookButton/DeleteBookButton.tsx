"use client"

import styles from "./deleteBookButton.module.css"

type DeleteBookButtonProps = {
  id: number
}

export default function DeleteBookButton(props: DeleteBookButtonProps) {
  const {id} = props

  const handleDelete = async () => {
    const confirmed = confirm('Are you sure that you want to delete this book')

    if(!confirmed) return
    
    try {
      await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });
    }catch(e) {
      console.error(e);
      throw new Error('Book is not deleted')
    }    
  }

  return (
    <button className={styles.deleteButton} onClick={handleDelete}>
      Delete
    </button>
  )
}