"use client";

import styles from "./UpdateUserForm.module.css";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserAction } from "@/actions/users";
import { updateUserClientSchema } from "@/lib/validation";

type FormValues = z.output<typeof updateUserClientSchema>

type Props = {
  user: FormValues & {
    id: number
  }
};

export default function UpdateUserForm({ user }: Props) {
  const { id, name, email, role } = user;

  const {
    register,
    handleSubmit,
    setError,
    formState: {errors, isSubmitting}
  } = useForm<
    z.input<typeof updateUserClientSchema>,
    unknown,
    FormValues
  >({
    resolver: zodResolver(updateUserClientSchema),
    defaultValues: {
      name,
      email,
      role,
    },
  })

  const onSubmit = async (
    _: FormValues,
    event?: React.BaseSyntheticEvent
  ) => {
    if(!event) return

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const result = await UpdateUserAction(formData)

    if(!result.success && result.errors) {
      for (const [field, message] of Object.entries(result.errors)) {
        if(!message) continue

        if(field === "form") {
          setError("root.serverError", {
            type: "server",
            message
          })
          continue
        }

        if(field === "name" || field === "email" || field === "role") {
          setError(field, {
            type: "server",
            message
          })
        }
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.updateUser}
    >
      {
        errors.root?.serverError && (
          <p className="fieldError">{errors.root.serverError.message}</p>
        )
      }
      <label>
        <span>name:</span>
        <input type="text" {...register("name")} />
        {
          errors?.name && (
            <p className="fieldError">{errors.name.message}</p>
          )
        }
      </label>
      <label>
        <span>email:</span>
        <input type="email" {...register("email")} />
        {
          errors?.email && (
            <p className="fieldError">{errors.email.message}</p>
          )
        }
      </label>
      <fieldset>
        <span>role:</span>
        <div className={styles.radioContainer}>
          <label>
            <input
              type="radio"
              value="USER"
              {...register("role")}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              value="ADMIN"
              {...register("role")}
            />
            Admin
          </label>
        </div>
        {
          errors?.role && (
            <p className="fieldError">{errors.role.message}</p>
          )
        }
      </fieldset>
      <input type="hidden" name="id" value={id} />
      <button type="submit">
        {isSubmitting ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}
