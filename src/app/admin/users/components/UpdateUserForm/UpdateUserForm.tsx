"use client";

import styles from "./UpdateUserForm.module.css";
import { Role } from "@/generated/prisma/enums";

type UpdateUserFormData = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type Props = { user: UpdateUserFormData };

export default function UpdateUserForm({ user }: Props) {
  const { id, name, email, role } = user;

  return (
    <form
      // onSubmit={handleSubmit(onSubmit)}
      className={styles.updateUser}
    >
      <label>
        <span>name:</span>
        <input type="text" name="name" defaultValue={name} />
      </label>
      <label>
        <span>email:</span>
        <input type="text" name="email" defaultValue={email} />
      </label>
      <fieldset>
        <span>role:</span>
        <div className={styles.radioContainer}>
          <label>
            <input type="radio" name="role" checked={role === "USER"} />User
          </label>
          <label>
            <input type="radio" name="role" checked={role === "ADMIN"} />Admin
          </label>
        </div>
      </fieldset>
      <input type="hidden" name="id" value={id} />
      <button type="submit">Update</button>
    </form>
  );
}
