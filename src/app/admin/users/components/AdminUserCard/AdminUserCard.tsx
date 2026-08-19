import Link from "next/link";
import DeleteUserButton from "../DeleteUserButton/DeleteUserButton";
import styles from "./AdminUserCard.module.css"

type Props = {
  user: {
    id: number;
    name: string | null;
    email: string;
    role: string;
  }
}

export default function AdminUserCard({user}: Props) {
  const { id, name, email, role } = user

  return (
    <article className={styles.card}>
      <dl>
        <dt>Name</dt>
        <dd>{name}</dd>

        <dt>Email</dt>
        <dd>{email}</dd>

        <dt>Role</dt>
        <dd>{role}</dd>
      </dl>
      <div className={styles.buttons}>
        <Link className={styles.updateButton} href={`/admin/users/update/${id}`}>Update</Link>
        <DeleteUserButton id={id} />
      </div>
    </article>
  )
}