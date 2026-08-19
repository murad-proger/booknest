import { getUserById } from "@/services/users";
import UpdateUserForm from "../../components/UpdateUserForm/UpdateUserForm";

type Props = {
  params: Promise<{id: string;}>;
};

export default async function AdminUserUpdatePage ({params}: Props) {
  const {id} = await params

  const user = await getUserById(Number(id))

  if(!user) {
    throw new Error('Cannot updating user. DB Fetch error.')
  }

  return (
    <>
      <h1>Update book</h1>
      <UpdateUserForm user={user} />
    </>
  )
}