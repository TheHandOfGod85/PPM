import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import NewAssetForm from '@/app/ui/assets/NewAssetForm'
import { getServerSession } from 'next-auth'

export default async function NewAssetPage() {
  const session = await getServerSession(authOptions)
  const cookie = session?.user.cookie
  const user = await getAuthenticatedUser(cookie)
  return <NewAssetForm user={user} />
}
