import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import NewAssetForm from '@/app/ui/assets/NewAssetForm'
import { getServerSession } from 'next-auth'

export default async function NewAssetPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user 
  return <NewAssetForm user={user} />
}
