import { prisma } from "@/lib/prisma";

type UserData = {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

type UpdateUserData = Partial<UserData>

export async function getUsers() {
  return prisma.user.findMany({
    omit: {
      password: true
    }
  })
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
    omit: {
      password: true,
    },
  })
}

export async function updateUser(id: number, data: UpdateUserData) {
  return prisma.user.update({
    where: { id },
    data
  })
}

export async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id }
  })
}