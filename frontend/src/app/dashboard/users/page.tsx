import { getAllUsers, getAuthenticatedUser } from '@/app/lib/data/user.data'
import UsersTable from '@/app/ui/users/UsersTable'
import { getCookie } from '@/utils/utilsAppRouter'

export default async function UsersPage() {
  const cookie = await getCookie()
  const user = await getAuthenticatedUser(cookie)
  const users = await getAllUsers(cookie)
  return <UsersTable user={user} users={users} />
}
