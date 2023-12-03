import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import NewPartAssetForm from '@/app/ui/assets/NewPartAssetForm'
import { getCookie } from '@/utils/utilsAppRouter'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'

export const metadata: Metadata = {
  title: 'New part',
  description: 'new part page',
}

interface NewPartAssetFormPageProps {
  params: {
    assetId: string
  }
}

export default async function NewPartAssetPage({
  params,
}: NewPartAssetFormPageProps) {
  const assetId = params.assetId
  if (!assetId) throw Error('Asset Id missing')
  const session = await getServerSession(authOptions)
  const cookie = session?.user.cookie
  const user = await getAuthenticatedUser(cookie)
  return <NewPartAssetForm user={user} assetId={assetId} />
}
