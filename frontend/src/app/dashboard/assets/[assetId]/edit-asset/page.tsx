import { getCookie } from '@/utils/utilsAppRouter'
import * as AssetApi from '@/app/lib/data/assets.data'
import { NotFoundError, UnauthorisedError } from '@/app/lib/http-errors'
import { redirect } from 'next/navigation'
import { getAuthenticatedUser } from '@/network/api/user.api'
import EditAssetForm from '@/app/ui/assets/EditAssetForm'
import { Asset } from '@/app/lib/models/asset'
import { User } from '@/app/lib/models/user'

interface EditAssetPageProps {
  seracParams: {
    assetId: string
  }
}
export default async function EditAssetPage({
  seracParams,
}: EditAssetPageProps) {
  let user: User | undefined = undefined
  let asset: Asset = {
    _id: '',
    name: '',
    description: '',
    serialNumber: '',
    parts: [],
    createdAt: '',
    updatedAt: '',
  }
  try {
    const cookie = getCookie()
    user = await getAuthenticatedUser()
    const assetId = seracParams.assetId
    if (!assetId) throw Error('Asset id missing')
    asset = await AssetApi.getAsset(assetId, cookie)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return { notFound: true }
    } else if (error instanceof UnauthorisedError) {
      redirect('/')
    } else {
      throw error
    }
  }

  return <EditAssetForm asset={asset} user={user} />
}
