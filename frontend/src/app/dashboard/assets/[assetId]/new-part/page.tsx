import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import NewPartAssetForm from '@/app/ui/assets/NewPartAssetForm'
import { getCookie } from '@/utils/utilsAppRouter'
import { Metadata } from 'next'

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
  const cookie = getCookie()
  const user = await getAuthenticatedUser(cookie)
  return <NewPartAssetForm user={user} assetId={assetId} />
}
