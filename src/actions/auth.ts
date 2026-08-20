"use server";

import z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "@/lib/validation";
import { signIn } from "@/lib/auth";
import { CredentialsSignin } from "next-auth";

export type RegisterState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export type LoginState = {
  errors: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
};

export async function register(_: RegisterState, formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;

    return {
      errors,
    };
  }

  const existUser = await prisma.user.findUnique({
    where: {
      email: result.data.email,
    },
  });

  if (existUser) {
    throw new Error("User already exist");
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 10);

  await prisma.user.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      password: hashedPassword,
    },
  });

  redirect("/");
}

export async function login(
  _: LoginState | undefined,
  formdata: FormData
): Promise<LoginState> {
  const result = loginSchema.safeParse({
    email: formdata.get("email"),
    password: formdata.get("password"),
  });

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;

    return {
      errors,
    };
  }

  try {
    await signIn("credentials", {
      email: result.data.email,
      password: result.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    throw error;
  }

  return {
    errors: {},
    success: true,
  };
}