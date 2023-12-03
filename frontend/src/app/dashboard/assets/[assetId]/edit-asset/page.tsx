import * as AssetApi from '@/app/lib/data/assets.data'
import EditAssetForm from '@/app/ui/assets/EditAssetForm'
import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import { getCookie } from '@/utils/utilsAppRouter'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface EditAssetPageProps {
  params: {
    assetId: string
  }
}
export default async function EditAssetPage({ params }: EditAssetPageProps) {
  const session = await getServerSession(authOptions)
  const cookie = session?.user.cookie
  const user = await getAuthenticatedUser(cookie)
  const assetId = params.assetId
  if (!assetId) throw Error('Asset id missing')
  const asset = await AssetApi.getAsset(assetId, cookie)

  return <EditAssetForm asset={asset} user={user} />
}
