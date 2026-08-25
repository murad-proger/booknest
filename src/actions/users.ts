"use server"

import { revalidatePath } from "next/cache";
import { deleteUser, getUserById, updateUser } from "@/services/users";
import { updateUserServerSchema } from "@/lib/validation";
import z from "zod";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth-utils";

type DeleteActionResult = {
  success: boolean;
  error?: string;
}

export type UpdateUserActionResult = {
  success: boolean;
  errors?: {
    name?: string;
    email?: string;
    role?: string;
    form?: string
  }
}

export async function deleteUserAction(
  id: number
): Promise<DeleteActionResult> {
  await requireAdmin()

  try {
    await deleteUser(id);

    revalidatePath("/admin/users");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete user"
    };
  }
}

export async function UpdateUserAction(
  formData: FormData
): Promise<UpdateUserActionResult> {
  await requireAdmin()

  const result = updateUserServerSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  })

  if(!result.success) {
    const errors = z.flattenError(result.error).fieldErrors

    return {
      success: false,
      errors: {
        name: errors.name?.join('. '),
        email: errors.email?.join('. '),
        role: errors.role?.join('. '),
      },
    }
  }

  const {id, ...data} = result.data

  const existingUser = await getUserById(id)

  if(!existingUser) {
    return {
      success: false,
      errors: {
        form: "User not found",
      },
    };
  }

  try {
    await updateUser(id, data)
  }catch{
    throw new Error('Failed to update user')
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}