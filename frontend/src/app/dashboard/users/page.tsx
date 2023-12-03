import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAllUsers, getAuthenticatedUser } from '@/app/lib/data/user.data'
import UsersTable from '@/app/ui/users/UsersTable'
import { getServerSession } from 'next-auth'

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  const cookie = session?.user.cookie
  const user = await getAuthenticatedUser(cookie)
  const users = await getAllUsers(cookie)
  return <UsersTable user={user} users={users} />
}
