import * as AssetApi from '@/app/lib/data/assets.data'
import EditAssetForm from '@/app/ui/assets/EditAssetForm'
import { getAuthenticatedUser } from '@/app/lib/data/user.data'
import { getCookie } from '@/utils/utilsAppRouter'

interface EditAssetPageProps {
  params: {
    assetId: string
  }
}
export default async function EditAssetPage({ params }: EditAssetPageProps) {
  const cookie = getCookie()
  const user = await getAuthenticatedUser(cookie)
  const assetId = params.assetId
  if (!assetId) throw Error('Asset id missing')
  const asset = await AssetApi.getAsset(assetId, cookie)

  return <EditAssetForm asset={asset} user={user} />
}
