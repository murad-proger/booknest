"use server"

import { revalidatePath } from "next/cache";
import { deleteUser } from "@/services/users";

type ActionResult = {
  success: boolean;
  error?: string;
}

export async function deleteUserAction(
  id: number
): Promise<ActionResult> {
  try {
    await deleteUser(id);

    revalidatePath("/admin/books");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete book"
    };
  }
}

export async function UpdateUserAction(formData: FormData) {
  
}