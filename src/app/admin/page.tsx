import styles from "./adminPage.module.css"
import Link from "next/link";

export default function AdminPage () {
  return (
    <>
      <h1>Admin page</h1>
      <section className={styles.links}>
        <Link
          href={'/admin/books'}
          className={styles.link}
        >
          Manage Books
        </Link>
      </section>
    </>
  )
}