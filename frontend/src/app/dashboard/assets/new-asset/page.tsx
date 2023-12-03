import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import NewAssetForm from '@/app/ui/assets/NewAssetForm'
import { getCookie } from '@/utils/utilsAppRouter'

export default async function NewAssetPage() {
  const cookie = await getCookie()
  const user = await getAuthenticatedUser(cookie)
  return <NewAssetForm user={user} />
}
