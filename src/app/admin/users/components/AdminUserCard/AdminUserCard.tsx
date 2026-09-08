import styles from "./AdminUserCard.module.css"

import LinkButton from "@/components/ui/LinkButton/LinkButton";
import DeleteUserButton from "../DeleteUserButton/DeleteUserButton";

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
        <LinkButton variant="secondary" href={`/admin/users/update/${id}`}>
          Update
        </LinkButton>
        <DeleteUserButton id={id} />
      </div>
    </article>
  )
}