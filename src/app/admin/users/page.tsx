import { getUsers } from "@/services/users"
import styles from "./AdminUsersPage.module.css"

import AdminUserCard from "./components/AdminUserCard/AdminUserCard"

export default async function AdminUsersPage() {
  const users = await getUsers()

  if(!users) {
    <>
      <h1>Users</h1>

      <div className="fieldError">
        Users fetch error
      </div>
    </>
  }

  if(users.length === 0) {
    <>
      <h1>Users</h1>
      
      <div>
        No users in db
      </div>
    </>
  }
  
  return (
    <>
      <h1>Users</h1>

      <div className={styles.container}>
        {users.map(user => <AdminUserCard key={user.id} user={user} />)}
      </div>
    </>
  )
}