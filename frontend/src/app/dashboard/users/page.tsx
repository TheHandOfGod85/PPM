import { getAllUsers } from '@/app/lib/data/user.data'
import UsersTable from '@/app/ui/users/UsersTable'
import { cookies } from 'next/headers'

export default async function UsersPage() {
  const users = await getAllUsers(cookies().toString())
  return <UsersTable users={users} />
}
